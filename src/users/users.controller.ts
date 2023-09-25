import { Controller, Body, Post, Get , UseGuards,Req} from '@nestjs/common';
import { UserService } from './users.service';
import { UserModel, UserProfile } from './models/create-user.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';


@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200})

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Body() user: UserModel, @Req() req) {
        return this.userService.createUser(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMySelfUser(@Req() req) {
        const userResult: UserProfile = await this.userService.getUserById(req.userProfile.id)
        return {
            "useId": userResult.id,
            "email": userResult.email
        }
    }

}
