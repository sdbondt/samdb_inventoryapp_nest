import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { SectionsEnum } from "src/types/types";

export class SignupDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsEnum(SectionsEnum, {
        message: 'Section must be eiter sales, supply, production, marketing or manufacturing.'
    })
    section: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must be minimum 8 characters long and contain a lowercase, uppercase and numeric character.'
    })
    password: string

    @IsNotEmpty()
    confirmPassword: string
}

export class LoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}