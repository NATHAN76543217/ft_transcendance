import { Optional } from "@nestjs/common";
import { Exclude } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export default class RegisterWithPasswordDto
{
    @IsNotEmpty()
    public name: string;

    @Exclude()
    @IsNotEmpty()
    public password: string;

    @Optional()
    public imgPath: string;
}