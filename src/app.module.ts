import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './users/interceptors/user.interceptor';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/message.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [UsersModule, AuthModule,
    ConfigModule.forRoot({
    isGlobal: true
  }),
    TypeOrmModule.forRoot({
    type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PORT as string),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Order, Message],
      synchronize: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    OrdersModule,
    MessagesModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  }],
})
export class AppModule {}
