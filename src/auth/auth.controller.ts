import { Controller, Get, Query, Body, Post, UsePipes, UseGuards, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserModel } from "src/users/models/create-user.model";
import { UserService } from "src/users/users.service";
import { AuthService } from './auth.service';
import { UserAuthenticationModel } from "./model/auth-model";
import { ValidationPipe } from "@nestjs/common";
import { Response } from 'express';
import { JwtAuthGuard } from "./guard/jwt-auth.guard";


@Controller("auth")
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200})

  @UsePipes(new ValidationPipe())
  @Post("/registration")
  async registrationUser(@Body() user: UserAuthenticationModel) {
    return this.authService.registration(user);
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  async loginUser(@Body() user: UserAuthenticationModel, @Res({passthrough: true}) res: Response) {
    const userRes = await this.authService.login(user)
    res.cookie('jwt', userRes.token, { 
      httpOnly: true, secure: true 
    });
    return userRes;
  }
}
