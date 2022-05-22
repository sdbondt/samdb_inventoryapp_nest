import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/users/interceptors/user.interceptor';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, DeliveredBoolean } from './dtos/dto';
import { Order } from './order.entity';
import { SearchOrdersInterface } from 'src/types/types';
import { Message } from 'src/messages/message.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>
    ) { } 

    async createOrder({ product, quantity, comment }: CreateOrderDto, user: UserInfo) {
        const orderUser = await this.usersRepository.findOne({ where: { id: user.id } })
        if (!orderUser) {
            throw new BadRequestException('No order found')
        }
        const order = this.ordersRepository.create({
            product,
            section: user.section,
            quantity,
            comment: comment || 'No extra comments',
            user: orderUser
        })
        await order.save()
        const supplyUsers = await this.usersRepository.find({ where: { section: 'supply' } })
        supplyUsers.forEach(async (supplyUser) => {
            const message = this.messagesRepository.create({
                order,
                receiver: supplyUser,
                content: 'An order has been made'
            })
            await message.save()
        })
        const userMessage = this.messagesRepository.create({
            order,
            receiver: orderUser,
            content: 'Your order has been received.'
        })
        await userMessage.save()
        return order

    }

    async getOrders(user: UserInfo, page: number, limit: number, delivered: string, direction) {
        const queryPage = page || 1
        const queryLimit = limit || 4
        const querySkip = (queryPage - 1) * queryLimit
        const where: SearchOrdersInterface = {}
        const sortField = delivered === 'true' ? 'updatedAt' : 'orderedAt'
        const queryDirection = direction !== 'ASC' ? 'DESC' : 'ASC'
        const order = {
            [sortField]: queryDirection
        }
        if (delivered) {
            where.delivered = delivered === 'true' ? true : false
        }
        if (user.section === 'supply') {
            const orders = this.ordersRepository.find({
                where,
                take: queryLimit,
                skip: querySkip,
                order
            })
            return orders
        } else {
            where.userId = user.id
            const orders = this.ordersRepository.find({
                where,
                take: queryLimit,
                skip: querySkip,
                order
            })
            return orders
        }
    }

    async getOrder(orderId: number, user: UserInfo) {
        const order = await this.ordersRepository.findOne({ where: { id: orderId } })
        if (!order) {
            throw new BadRequestException('No order found')
        } else if (order.userId !== user.id && user.section !== 'supply') {
            throw new UnauthorizedException('Not allowed to check this order.')
        } else {
            return order
        }
    }

    async deleteOrder(orderId: number, user: UserInfo) {
        const order = await this.getOrder(orderId, user)
        if (order.delivered) {
            if (user.section === 'supply') {
                await order.remove()
                return { message: 'Order deleted.' }
            } else {
                throw new UnauthorizedException('You can\'t delete an order that has already been delivered.')
            }
        } else {
            await order.remove()
            return { message: 'Order deleted.' }
        } 
    }

    async createDelivery(orderId: number, user: UserInfo) {
        if (user.section !== 'supply') {
            throw new UnauthorizedException('You are not allowed to update an order.')
        } else {
            const order = await this.getOrder(orderId, user)
            const orderUser = await this.usersRepository.findOne({ where: { id: user.id }})
            order.delivered = true
            await order.save()
            const userMessage = this.messagesRepository.create({
                order,
                receiver: orderUser,
                content: 'Your order has been deliverd'
            })
            await userMessage.save()
            return { message: 'Order got delivered.'}
        }
    }
}
