import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../message.entity';

export default class CreateMessageDto {
  @IsOptional()
  @IsNumber()
  channel_id?: number;
  @IsOptional()
  @IsNumber()
  receiver_id?: number;
  type: MessageType;
  @IsString()
  data: string;
}
