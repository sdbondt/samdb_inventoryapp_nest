import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/users/interceptors/user.interceptor';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    ) { }
    
    async getMessages(user: UserInfo) {
        const messages = await Message.find({ where: { receiverId: user.id } })
        return messages
    }
    
    async getMessage(user: UserInfo, messageId: number) {
        const message = await Message.findOne({ where: { id: messageId, receiverId: user.id } })
        if (!message) {
            throw new NotFoundException()
        } else {
            return message
        }
    }

    async deleteMessage(user: UserInfo, messageId: number) {
        const message = await this.getMessage(user, messageId)
        await message.remove()
        return { message: 'Message got deleted.'}
    }
}
