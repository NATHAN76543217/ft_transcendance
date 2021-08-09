import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";
import User from "../user.entity";
import { UserRelationshipTypes } from '../relationships/userRelationshipTypes'

export default class CreateUserRelationshipDto {
    @IsNumberString()
    @IsNotEmpty()
    public user1_id: string;

    @IsNumberString()
    @IsNotEmpty()
    public user2_id: string;

    // @IsOptional()
    @IsNumber()
    public type: UserRelationshipTypes;
}