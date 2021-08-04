import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ChannelsService from 'src/channels/channels.service';
import { Repository } from 'typeorm';
import CreateMessageDto from './dto/createMessage.dto';
import UpdateMessageDto from './dto/updateMessage.dto';
import { Message, MessageType } from './message.entity';

@Injectable()
export default class MessageService {
  private logger = new Logger('MessageService');

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @Inject(forwardRef(() => ChannelsService))
    private channelsService: ChannelsService,
  ) { }

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
    const message = await this.messageRepository.findOne({
      where: { id: id },
    });

    if (message && message.type === MessageType.GameInvite) {
      const cancelMessage = {
        channel_id: 1,
        type: MessageType.GameCancel,
        data: id.toFixed(),
        receiver_id: message.receiver_id,
        sender_id: message.sender_id,
      }
      this.logger.debug(`Deleting invitation from user ${message.sender_id}...`);
      this.channelsService.sendUserMessage(message.sender_id, cancelMessage)
    }

    const deleteResponse = await this.messageRepository.delete(id);
    if (!deleteResponse.affected)
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
  }
}
