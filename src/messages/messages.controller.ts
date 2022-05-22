import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { User } from 'src/users/decorators/user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UserInfo } from 'src/users/interceptors/user.interceptor';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
    constructor(
        private readonly messageService: MessagesService
    ) { }
    
    @Get('/')
    async getMessages(
        @User() user: UserInfo
    ) {
        return this.messageService.getMessages(user)
    }
    
    @Get('/:messageId')
    async getMessage(
        @Param('messageId', ParseIntPipe) messageId: number,
        @User() user: UserInfo
    ) {
        return this.messageService.getMessage(user, messageId)
    }

    @Delete('/:messageId')
    async deleteMessage(
        @Param('messageId', ParseIntPipe) messageId: number,
        @User() user: UserInfo
    ) {
       return this.messageService.deleteMessage(user, messageId)

    }
}
