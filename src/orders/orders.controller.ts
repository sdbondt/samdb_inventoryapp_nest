import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/users/interceptors/user.interceptor';
import { User } from 'src/users/decorators/user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto,  } from './dtos/dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) { }
    
    @Post('/')
    async createOrder(
        @User() user: UserInfo,
        @Body() body: CreateOrderDto
    ) {
        return this.ordersService.createOrder(body, user)
    }

    @Get('/')
    async getOrders(
        @User() user: UserInfo,
        @Query('limit') limit?: string,
        @Query('page') page?: string,
        @Query('delivered') delivered?: string,
        @Query('direction') direction?: string
    ) {
        return this.ordersService.getOrders(user, parseInt(page), parseInt(limit), delivered, direction)
    }

    @Get('/:orderId')
    async getOrder(
        @User() user: UserInfo,
        @Param('orderId', ParseIntPipe) orderId: number
    ) {
        return this.ordersService.getOrder(orderId, user)
    }

    @Post('/:orderId/delivery')
    async createDelivery(
        @Param('orderId', ParseIntPipe) orderId: number,
        @User() user: UserInfo,
    ) {
        return this.ordersService.createDelivery(orderId, user)
    }

    @Delete('/:orderId')
    async deleteOrder(
        @User() user: UserInfo,
        @Param('orderId', ParseIntPipe) orderId: number
    ) {
        return this.ordersService.deleteOrder(orderId, user)
    }
}
