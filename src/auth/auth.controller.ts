import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('/signup')
    async signup(
        @Body() { password, confirmPassword, username, email, section }: SignupDto
    ) {
        if (password !== confirmPassword) {
            throw new UnauthorizedException('Passwords don\'t match.')
        } else {
            return this.authService.signup(email, username, password, section)
        }
    }

    @Post('/login')
    async login(
        @Body() { password, email }: LoginDto
    ) {
        return this.authService.login(email, password)
    }
}
