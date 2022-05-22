import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { UsersService } from './users.service';
import { UserInfo } from './interceptors/user.interceptor'
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/dto';


@Controller('users')
// @UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('/')
    async getUsers(
        @Query('q') q?: string,
        @Query('limit') limit?: string,
        @Query('page') page?: string
    ) {
        return this.usersService.findUsers(q, parseInt(page), parseInt(limit))
    }

    @Get('/me')
    async getMyProfile(
        @User() user: UserInfo
    ) {
        return this.usersService.getMe(user)
    }

    @Get('/:userId')
    async getUser(
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.usersService.findUser(userId)
    }

    @Patch('/:userId')
    async updateUser(
        @Param('userId', ParseIntPipe) userId: number,
        @User() user: UserInfo,
        @Body() body: UpdateUserDto
    ) {
        return this.usersService.updateUser(userId, user, body)
    }

    @Delete('/:userId')
    async deleteUser(
        @Param('userId', ParseIntPipe) userId: number,
        @User() user: UserInfo,
    ) {
        return this.usersService.deleteUser(userId, user)
    }
    
}
