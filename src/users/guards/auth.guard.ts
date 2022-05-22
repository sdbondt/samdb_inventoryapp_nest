import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import * as jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { User } from '../user.entity'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly: Reflector,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }
    
    async canActivate(context: ExecutionContext) {
        try {
            const request = context.switchToHttp().getRequest()
            const token = request?.headers?.authorization?.split("Bearer ")[1]
            const user = await jwt.decode(token)
            if (!user) {
                return false
            } else {
                return true
            }
        } catch (e) {
            return false
        }
        
    }
}