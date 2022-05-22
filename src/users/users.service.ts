import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs'
import { UserInfo } from './interceptors/user.interceptor';
import { UpdateUserDto } from './dto/dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }
    
    async findUsers(q: string, page: number, limit: number): Promise<User[]> {
        const queryPage = page || 1
        const queryLimit = limit || 4
        const querySkip = (queryPage -1) * queryLimit
        if (q) {
            const users = await this.usersRepository.find({
                where: [{ username: Like(`%${q}%`) }, { email: Like(`%${q}%`) }],
                take: queryLimit,
                skip: querySkip
            })
            return users
        } else {
            const users = await this.usersRepository.find({
                take: queryLimit,
                skip: querySkip
            })
            return users
        }
        
    }

    async findUser(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new NotFoundException('No user found.')
        } else {
            return user
        }
    }

    async updateUser(userId: number, user: UserInfo, { email, username, password}: UpdateUserDto): Promise<User> {
        if (user.id !== userId) {
            throw new UnauthorizedException('Not authorized to update another users data.')
        } else {
            const updateUser = await this.usersRepository.findOne({ where: { id: userId } })
            if (!updateUser) {
                throw new NotFoundException('No such user has been found.')
            } else {
                if (email) {
                    const emailExist = await this.usersRepository.findOne({ where: { email } })
                    if (emailExist) {
                        throw new ConflictException('User already exists')
                    } else {
                        updateUser.email = email
                    }
                }
    
                if (username) {
                    updateUser.username = username
                }
    
                if (password) {
                    const hashedPW = await this.hashPW(password)
                    updateUser.password = hashedPW
                }
    
                await updateUser.save()
                return updateUser
            }
        }
    }

    async deleteUser(userId: number, user: UserInfo) {
        if (user.id != userId) {
            throw new UnauthorizedException('Not authorized to do this.')
        }
        const deleteUser = await this.usersRepository.findOne({ where: { id: userId } })
        if (!deleteUser) {
            throw new NotFoundException('No such user found')
        } else {
            await deleteUser.remove()
            return {
                message: 'User deleted'
            }
        }
    }

    async getMe(user: UserInfo) {
        const findUser = await this.usersRepository.findOne({
            where: { id: user.id },
            relations: ['messages']
        })
        if (!findUser) {
            throw new NotFoundException()
        } else {
            return findUser
        }
    }

    private async hashPW(password: string) {
        const hashedPW = await bcrypt.hash(password, 10)
        return hashedPW
    }
}
