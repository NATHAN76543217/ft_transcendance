import { Ruleset } from './ruleset.dto';

import { IsBoolean, IsNumber, IsOptional, Max, IsArray, IsDate, ArrayNotEmpty, ArrayUnique, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchDto {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(1)
  @ArrayMinSize(1)
  @Type(() => Number)
  guests: number[];

  ruleset: Ruleset;

  @IsOptional()
  @IsDate()
  startedAt?: Date;
};
