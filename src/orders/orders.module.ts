import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, MessagesModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
