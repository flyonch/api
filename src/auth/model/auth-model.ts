import { ApiProperty } from "@nestjs/swagger";

export class UserAuthenticationModel {
    email: string;
    password: string;
}

export class UserAuthenticationErrorModel {
    Status: string;
    Message: string;
}