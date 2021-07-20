import { MessageType } from '../message.entity';

export default interface CreateMessageDto {
  channel_id: number;
  type: MessageType;
  data: string;
}
