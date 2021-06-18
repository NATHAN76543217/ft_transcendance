import { IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class UpdateChannelDto {
    @IsNotEmpty()
    @IsNumberString()
    id: number;

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
