import { IsBoolean, IsNumber, IsOptional, Max } from 'class-validator';

export class Ruleset {
  @IsOptional()
  @IsNumber()
  // TODO: @Min and @Max
  duration?: number; // todo

  @IsOptional()
  @IsNumber()
  // TODO: @Min and @Max
  rounds?: number;

  @IsOptional()
  @IsNumber()
  // TODO: @Min and @Max
  size?: number;

  @IsOptional()
  @IsBoolean()
  speedMode?: boolean;

  @IsOptional()
  @IsBoolean()
  downsize?: boolean;
}
