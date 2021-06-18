import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    password: string;
    
    @IsString()
    @IsNotEmpty()
    mode: string;
}