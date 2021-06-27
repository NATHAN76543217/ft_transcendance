import UsersService from "src/users/users.service";
import { HttpException, HttpStatus, Redirect } from "@nestjs/common";
import { PostgresErrorCode } from "../database/postgresErrorCodes";
import RegisterWithPasswordDto from "./dto/registerWithPassword.dto";
import UserNameAlreadyExistsException from "./exception/UserNameAlreadyExists.exception";
import WrongCredentialsException from "./exception/WrongCredentials.exception";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";

// import bcrypt from "bcrypt";
import * as bcrypt from 'bcrypt'; // for unit tests

export class AuthenticationService {
  constructor(
	private readonly usersService: UsersService,
	private readonly jwtService: JwtService,
	private readonly configService: ConfigService,
  ) {}
  
  public async registerWithPassword(registrationData: RegisterWithPasswordDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserNameAlreadyExistsException(registrationData.name);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
	const isPasswordMatching = await bcrypt.compare(
	  plainTextPassword,
	  hashedPassword
	);
	
	if (!isPasswordMatching) {
	  throw new WrongCredentialsException();
	}
  }

  public async getAuthenticatedUserWithPassword(name: string, plainTextPassword: string) {
	try {
	  const user = await this.usersService.getUserByName(name);
	  
	  await this.verifyPassword(plainTextPassword, user.password);
	  user.password = undefined;
	  return user;
	} catch (error) {
	  throw new WrongCredentialsException();
	}
  }


  public getCookieWithJwtToken(userId: number) {
	const payload: TokenPayload = { userId };
	const token = this.jwtService.sign(payload);
	return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}; SameSite=None; Secure`;
  }

  public getCookieForLogOut() {
	return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}