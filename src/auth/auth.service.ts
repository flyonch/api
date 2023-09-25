import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "../users/users.service";
import { UserModel } from "src/users/models/create-user.model";
import { DbService } from "src/db/db.service";
import * as bcrypt from "bcrypt";
import { ApiTags } from "@nestjs/swagger"; // Импортируем необходимые аннотации
import {
  UserAuthenticationErrorModel,
  UserAuthenticationModel,
} from "./model/auth-model";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Injectable()
@ApiTags("Authentication")
export class AuthService {
  constructor(
    private usersService: UserService,
    private databaseService: DbService,
    private jwtService: JwtService
  ) {}

  async login(userLogin: UserAuthenticationModel) {
    const user = await this.userValidate(userLogin);
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    const token = await this.generateToken(user);
    
    //возвращаемые данные по модели при успешком логине
    const userResponse = {
      id: user.id, 
      email: user.email, 
      token,
    };

    return userResponse;
  }

  async registration(user: UserAuthenticationModel) {
    try {  
      const userResult = await this.usersService.createUser(user);
  
      if (userResult.Status == "Success") {
        return {
          token: await this.generateToken(userResult.Data),
        };
      } else {
        throw userResult.Message;
      }
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw new BadRequestException("Ошибка при создании пользователя:", error);
    }
  }
  

  //// Вспомогательные функции
  private async generateToken(user: UserModel) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload)
  }

  private async userValidate(userValidate: UserAuthenticationModel) {
    const query = `
      SELECT * FROM public.users WHERE email = $1
    `;
    const params = [userValidate.email];

    try {
      const queryResult = await this.databaseService.query(query, params);

      const userExist: UserModel = queryResult.rows[0];
      const passwordEquals = bcrypt.compareSync(
        userValidate.password,
        userExist.password
      );
      if (userExist && passwordEquals) {
        return userExist;
      } else {
        throw Error;
      }
    } catch (error) {
      throw new UnauthorizedException({ message: "Не веный Email или пароль" });
    }
  }
  
}
