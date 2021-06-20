import { Optional } from "@nestjs/common";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export default class RegisterWithPasswordDto
{
    @IsString()
    @IsNotEmpty()
    public name: string;

    // @Exclude()
    @IsString()
    @IsNotEmpty()
    public password: string;

    @IsString()
    @Optional()
    public imgPath: string;
}