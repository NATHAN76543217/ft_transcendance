import UsersService from 'src/users/users.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PostgresErrorCode } from '../database/postgresErrorCodes';
import RegisterWithPasswordDto from './dto/registerWithPassword.dto';
import UserNameAlreadyExistsException from './exception/UserNameAlreadyExists.exception';
import WrongCredentialsException from './exception/WrongCredentials.exception';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import User from 'src/users/user.interface';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async registerWithPassword(registrationData: RegisterWithPasswordDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserNameAlreadyExistsException(registrationData.name);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }
  }

  public async getAuthenticatedUserWithPassword(
    name: string,
    plainTextPassword: string,
  ) {
    try {
      const user = await this.usersService.getUserByName(name, true, true);

      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  public async getUserFromAuthenticationToken(
    token: string,
    withChannels = false,
  ) {
    const payload: TokenPayload = this.jwtService.verify(token);

    return this.usersService.getUserById(payload.userId, withChannels);
  }

  async getUserFromSocket(socket: Socket, withChannels = true): Promise<User> {
    const cookie = socket.handshake.headers.cookie ?? '';
    const { Authentication: token } = parse(cookie);

    if (!token) throw new WsException('Missing token.');

    const user = await this.getUserFromAuthenticationToken(token, withChannels);

    if (!user) {
      throw new WsException('Invalid token.');
    }
    return user;
  }

  public getCookieWithJwtToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const expirationTime = this.configService.get('JWT_EXPIRATION_TIME');

    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expirationTime}; SameSite=None; Secure`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  /*   public getJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return token;
  } */

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
