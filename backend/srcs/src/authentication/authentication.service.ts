import UsersService from "src/users/users.service";
import { HttpException, HttpStatus, Redirect } from "@nestjs/common";
import { PostgresErrorCode } from "../database/postgresErrorCodes";
import RegisterWithPasswordDto from "./dto/registerWithPassword.dto";
import UserNameAlreadyExistsException from "./exception/UserNameAlreadyExists.exception";
import WrongCredentialsException from "./exception/WrongCredentials.exception";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";
import axios from 'axios';

// import bcrypt from "bcrypt";
import * as bcrypt from 'bcrypt'; // for unit tests

import CreateUserDto from "src/users/dto/CreateUser.dto";
import User from "src/users/user.entity";

export class AuthenticationService {
  constructor(
	private readonly usersService: UsersService,
	private readonly jwtService: JwtService,
	private readonly configService: ConfigService,
  ) {}
  
  public async registerWithPassword(registrationData: RegisterWithPasswordDto) {
	const hashedPassword = await bcrypt.hash(registrationData.password, 10);
	try {
	  let createdUser = await this.usersService.createUser({
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

  public async registerWithOauth(accessToken: string) {
	let userData = await (await axios.get("https://api.intra.42.fr/me")).data;
	try {
	  let createdUser = await this.usersService.createUser({
		name: userData.login,
		password: "",
		oauth_id: userData.id
	  });
	  createdUser.password = undefined;
	  return createdUser;
	} catch (error) {
	  if (error?.code === PostgresErrorCode.UniqueViolation) {
		throw new UserNameAlreadyExistsException(userData.login);
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

  public async authenticateUserWithOauth(code: string, api: string): Promise<User> {
	
	console.log("--code-- ", code);
	if (api === '42')
	{
		const { data }  = await axios.post('https://api.intra.42.fr/oauth/token', {
			grant_type: 'authorization_code',
			client_id: process.env.OAUTH_42_UID ,
			client_secret: process.env.OAUTH_42_SECRET,
			code: code
		  });
		console.log("data = ",data);
		const config = {
			headers: { Authorization: 'Bearer ' + data.access_token }
		};
		const user_data = await (await axios.get("https://api.intra.42.fr/v2/me", config)).data
		const user = this.usersService.getUserBy42Id(user_data.id)
	//  .then((v) => {
	// 	 return this.usersService.l ;
	//  }) 
	  .catch((e) => {
		return this.registerWithOauth(data.access_token );
	  });
	  return user;
	}
  }

  public getCookieWithJwtToken(userId: number) {
	const payload: TokenPayload = { userId };
	const token = this.jwtService.sign(payload);
	return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
	return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}