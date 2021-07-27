import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateMessageDto from './dto/createMessage.dto';
import UpdateMessageDto from './dto/updateMessage.dto';
import { Message } from './message.entity';

@Injectable()
export default class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // TODO: Check if we need this
  /*
  getAllMessages() {
    return this.messageRepository.find();
  }

  async getMessageById(id: number) {
    const message = await this.messageRepository.findOne(id);
    if (message) return message;
    throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
  } */

  async createMessage(message: CreateMessageDto, senderId: number) {

console.log('--------------- createMessage ----------------', message)
    // if (!message.channel_id) {
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
