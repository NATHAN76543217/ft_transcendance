import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean } from "class-validator";
import { UserRelationshipTypes } from '../utils/userRelationshipTypes'

export default class UpdateUserRelationshipDto {
	@IsOptional()
    @IsNumber()
    public type: UserRelationshipTypes;
}