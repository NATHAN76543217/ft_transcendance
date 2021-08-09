import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean } from "class-validator";
import { UserRelationshipTypes } from '../relationships/userRelationshipTypes'

export default class UpdateUserRelationshipDto {
	@IsOptional()
    @IsNumber()
    public type: UserRelationshipTypes;
}