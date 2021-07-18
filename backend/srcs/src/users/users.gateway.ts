import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import UsersService from './users.service';
import { SocketWithUser } from 'src/authentication/socketWithUser.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';

@WebSocketGateway(undefined, { namespace: '/users' })
export class UsersGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('UsersGateway');

    constructor(
        private readonly usersService: UsersService
    ) {
    }

    afterInit(server: Server) {
        this.logger.debug(`Listening at ${server.path()}`);
    }


    async handleConnection(client: Socket) {
        
        // client.on('connection', () => {
        //     console.log(`connection detected`)
        //     this.logger.debug('logger debug connection detected');
        // })

        // client.on('disconnection', () => {
        //     console.log(`disconnection detected`)
        //     this.logger.debug('logger debug disconnection detected');
        // })
        
        client.emit('connection')

        client.on('disconnecting', () => {
            // TODO: set offline status
            this.logger.debug(
              `Client disconnecting with ${client.rooms.size} joined rooms`,
            );
        })
        
        return this.logger.log(`Client connected: ${client.id}`);
    }


    async handleDisconnect(client: Socket) {
        client.emit('disconnection')
        return this.logger.log(`Client disconnected: ${client.id}`);
    }


   
    @SubscribeMessage('connection')
    async listenForConnection(
        @ConnectedSocket() socket: Socket,
    ) {
        const user = await  this.usersService.getUserFromSocket(socket);

       console.log(`user with id ${user.id} has just connected`)
    }

    @SubscribeMessage('disconnection')
    async listenForDisconnection(
        @ConnectedSocket() socket: Socket,
    ) {
        const user = await this.usersService.getUserFromSocket(socket);

       console.log(`user with id ${user.id} has just disconnected`)
    }

    async connectUser(id: number) {
        this.server.emit('connecting');
    }
}