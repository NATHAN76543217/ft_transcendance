import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";
import User from "../user.entity";
import { UserRelationshipTypes } from '../utils/userRelationshipTypes'

export default class CreateUserRelationshipDto {
    @IsNumberString()
    @IsNotEmpty()
    public user1_id: number;

    @IsNumberString()
    @IsNotEmpty()
    public user2_id: number;

    // @IsOptional()
    @IsNumber()
    public type: UserRelationshipTypes;
}