import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsNumberString,
  } from 'class-validator';
import { ChannelRelationshipType } from '../relationships/channel-relationship.type';
  
  export class JoinChannelDto { 
    @IsString()
    @IsOptional()
    password: string;

    // @IsNumber()
    @IsNumberString()
    @IsNotEmpty()
    type: ChannelRelationshipType;
  }
