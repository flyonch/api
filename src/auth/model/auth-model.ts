import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from 'class-validator';


export class UserAuthenticationModel {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}

export class UserAuthenticationErrorModel {
    Status: string;
    Message: string;
}