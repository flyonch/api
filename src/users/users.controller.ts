import { Controller, Body, Post, Get , UseGuards} from '@nestjs/common';
import { UserService } from './users.service';
import { UserModel } from './models/create-user.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200})

    @Post()
    create(@Body() user: UserModel) {
        return this.userService.createUser(user)
    }
}
