import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class Ruleset {
  @IsOptional()
  @IsNumber()
  @Max(3)
  @Min(3)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(15)
  rounds?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(2)
  size?: number;

  @IsOptional()
  @IsBoolean()
  speedMode?: boolean;

  @IsOptional()
  @IsBoolean()
  downsize?: boolean;
}
