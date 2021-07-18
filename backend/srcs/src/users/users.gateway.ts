import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import UsersService from './users.service';
import { SocketWithUser } from 'src/authentication/socketWithUser.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';


@Injectable()
@WebSocketGateway(undefined, { namespace: '/users' })
export class UsersGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('UsersGateway');


    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {
    }

    afterInit(server: Server) {
        this.logger.debug(`Listening at ${server.path()}`);
    }

    async handleConnection(socket: SocketWithUser) {

        this.logger.debug(`Query: ${JSON.stringify(socket.handshake.query)}`);
        try {
            socket.user = await this.usersService.getUserFromSocket(socket);
        } catch (e) {
            console.log("socket disconnected")
            socket.disconnect(true);
            return;
        }

        socket.emit('authenticated');

        socket.join('userStatus')

        socket.to('userStatus').emit('authenticated');

        socket.on('disconnecting', () => {
            // TODO: set offline status
            this.logger.debug(
              `Client disconnecting with ${socket.rooms.size} joined rooms`,
            );
      
            socket.rooms.forEach((r) => {
              socket.to(r).emit('disconnected', { username: socket.user.name });
            });
          });

        // socket.on('connected', () => {
        //     socket.join("userStatus");
        //     socket.to('userStatus').emit('newConnectedUser');
        // })

        this.logger.debug(
            `Users ${socket.user?.name} - Client connected with ${socket.rooms.size} joined rooms`,
        );

        console.log('handleConnection - end')

        return { event: 'connected' };
    }


    async handleDisconnect(socket: SocketWithUser) {
        this.logger.debug(
            `Client disconnect with ${socket.rooms.size} joined rooms`,
        );
        // socket.to("userStatus").emit('disconnected');
    }

    @SubscribeMessage('authentication')
    async handleMessage(
        @ConnectedSocket() socket: Socket,
    ) {
        this.server.emit('userConnected')
    }

    @SubscribeMessage('create')
    async createRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() room: string,
    ) {
        const author = await this.usersService.getUserFromSocket(socket);
        console.log("room", room)

        socket.join(room)

        console.log(`user ${author.name} just joined room ${room}`)

        // TODO: Replace getUser with SocketWithUser
        // TODO: Broadcast messages by room
        // TODO: Save messages to repository

        this.logger.debug(`${author.name}: ${room}`);
    }

}