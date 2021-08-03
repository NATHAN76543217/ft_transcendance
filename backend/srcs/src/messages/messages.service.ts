import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateMessageDto from './dto/createMessage.dto';
import UpdateMessageDto from './dto/updateMessage.dto';
import { Message } from './message.entity';

@Injectable()
export default class MessageService {
  private logger = new Logger('MessageService');

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(message: CreateMessageDto, senderId: number) {
    this.logger.debug(`createMessage: ${JSON.stringify(message)}`);
    // if (message.channel_id === undefined) {
    //   message.channel_id = 0;
    // }
    const newMessage = this.messageRepository.create({
      ...message,
      sender_id: senderId,
    });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async updateMessage(id: number, message: UpdateMessageDto) {
    await this.messageRepository.update(id, message);
    const updatedMessage = await this.messageRepository.findOne(id);
    if (updatedMessage) return updatedMessage;
    throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
  }

  async deleteMessage(id: number) {
    const deleteResponse = await this.messageRepository.delete(id);
    if (!deleteResponse.affected)
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
  }
}
