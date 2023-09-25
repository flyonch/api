import { ApiProperty } from "@nestjs/swagger";

export class UserModel {
    readonly id: number;
    @ApiProperty({example: 'name@mail.ru', description: 'Почта'})
    readonly email: string;
    @ApiProperty({example: '12345678', description: 'Пароль'})
    readonly password: string;
}

export class UserProfile {
    readonly id: number;
    readonly email: string;
}