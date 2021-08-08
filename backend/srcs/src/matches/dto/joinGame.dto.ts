import { IsNumber, IsOptional, Min } from "class-validator";

export class JoinGameDto {

  @IsNumber()
  @IsOptional()
  @Min(0)
  roomId: number;

  @IsOptional()
  @IsNumber()
  messageId?: number;
};
