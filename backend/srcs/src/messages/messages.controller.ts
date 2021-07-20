import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import MessagesService from './messages.service';
import CreateMessageDto from './dto/createMessage.dto';
import UpdateMessageDto from './dto/updateMessage.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

// TODO: Message CASL
@Controller('messages')
@UseGuards(JwtAuthenticationGuard)
export default class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  /*  @Get()
    getAllMessages() {
        return this.messageService.getAllMessages();
    }
    @Get(':id')
    getMessageById(@Param('id') id: string) {
        return this.messageService.getMessageById(Number(id));
    }

    @Post()
    async createMessage(@Body() message: CreateMessageDto) {
        return this.messageService.createMessage(message);
    }
    */
  // TODO: Authorization
  @Patch(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() message: UpdateMessageDto,
  ) {
    return this.messageService.updateMessage(Number(id), message);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.deleteMessage(Number(id));
  }
}
