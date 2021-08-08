import { IsNumber, IsOptional, Min } from "class-validator";

export class MousePosDto {
    @IsNumber()
    x: number;

    @IsNumber()
    y: number;
}