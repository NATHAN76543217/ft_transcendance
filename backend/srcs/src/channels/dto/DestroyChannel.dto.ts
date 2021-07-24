import {
    IsNumber,
  } from 'class-validator';
  
  export class DestroyChannelDto {
    @IsNumber()
    channel_id: number
  }
