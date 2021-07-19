import { MessageType } from '../message.entity';

export default class CreateMessageDto {
  channel_id: number;
  type: MessageType;
  data: string;
}
