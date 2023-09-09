import { Controller, Get, Query, Body, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserModel } from "src/users/models/create-user.model";
import { UserService } from "src/users/users.service";
import { AuthService } from './auth.service';
import { UserAuthenticationModel } from "./model/auth-model";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200})

  @Post("/registration")
  async registrationUser(@Body() user: UserAuthenticationModel) {
    return this.authService.registration(user);
  }

  @Post("/login")
  async loginUser(@Body() user: UserAuthenticationModel) {
    return this.authService.login(user);
  }
}
