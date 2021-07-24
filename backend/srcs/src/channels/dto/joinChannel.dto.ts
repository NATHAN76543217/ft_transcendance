import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsNumberString,
  } from 'class-validator';
import { ChannelRelationshipType } from '../relationships/channel-relationship.type';
  
  export class JoinChannelDto {
    @IsNumber()
    channel_id: number

    // @IsNumber()
    // user_id: number

    @IsString()
    @IsOptional()
    password: string;

    // @IsNumber()
    // // @IsNumberString()
    // @IsOptional()
    // type: ChannelRelationshipType;
  }
