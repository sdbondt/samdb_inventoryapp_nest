import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    @IsNotEmpty()
    email?: string
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    username?: string

    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must 8 characters long and contain lowercase, uppercase and numeric symbol'
    })
    password?: string
}