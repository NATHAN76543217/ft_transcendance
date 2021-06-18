import { IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    mode: string;
}
