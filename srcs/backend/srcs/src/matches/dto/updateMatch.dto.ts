import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsOptional } from "class-validator";

export default class UpdateMatchDto {

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, {each: true})
  @ArrayMaxSize(2, {each: true})
  @IsNotEmpty()
  playerIds?: number[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, {each: true})
  @ArrayMaxSize(2, {each: true})
  @IsNotEmpty()
  scores?: number[];

  @IsDate()
  endAt?: Date;
}
