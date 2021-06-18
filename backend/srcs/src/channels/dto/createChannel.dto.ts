import { IsString, IsNotEmpty } from "class-validator";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    password: string;
    
    @IsString()
    @IsNotEmpty()
    mode: string;
}