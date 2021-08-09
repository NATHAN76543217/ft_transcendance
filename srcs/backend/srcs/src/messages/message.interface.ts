import { MessageType } from './message.entity';

export default interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  channel_id: number;
  created_at: Date;
  updated_at: Date;
  type: MessageType;
  data: string;
}
