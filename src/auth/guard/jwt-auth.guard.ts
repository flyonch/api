// выполянем проверку пользотвалея по JWT и подставляем в middleware данные профиля по JWT.

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { UserService } from "src/users/users.service";
import { UserModel, UserProfile } from "src/users/models/create-user.model";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            if (req.cookies && req.cookies.jwt) {
                const userJwt = this.jwtService.verify(req.cookies.jwt);
                const resultSearchUser = await this.userService.getUserById(userJwt.sub);
                const user: UserModel = resultSearchUser;
                req.userProfile = {
                    "id": user.id,
                    "email": user.email
                };
                return true;
            }

            const authHeader = req.headers.authorization;
            if (authHeader) {
                const bearer = authHeader.split(' ')[0];
                const token = authHeader.split(' ')[1];

                if (bearer === 'Bearer' && token) {
                    const userJwt = this.jwtService.verify(token);
                    const resultSearchUser: UserModel  = await this.userService.getUserById(userJwt.sub);
                    req.userProfile = {
                        "id": resultSearchUser.id,
                        "email": resultSearchUser.email,
                    };
                    return true;
                }
            }

            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        } catch (error) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
    }
}
