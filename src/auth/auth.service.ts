import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
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
import * as jwt from "jsonwebtoken";

@Injectable()
@ApiTags("Authentication")
export class AuthService {
  constructor(
    private usersService: UserService,
    private databaseService: DbService
  ) {}

  async login(userLogin: UserAuthenticationModel) {
    const user = await this.userValidate(userLogin);
    return this.generateToken(user);
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
    const secret = process.env.PRIVATE_KEY;
    const options = { expiresIn: "1h" };

    return jwt.sign(payload, secret, options);
  }

  private async userValidate(user: UserAuthenticationModel) {
    const query = `
      SELECT email, password FROM public.users WHERE email = $1
    `;
    const params = [user.email];

    try {
      const userQuery = await this.databaseService.query( query, params );
      const storedPasswordHash = userQuery.rows[0].password;      
      const passwordEquals = bcrypt.compareSync(user.password, storedPasswordHash)
      if (userQuery && passwordEquals) {
        return userQuery;
      } else {
        throw Error;
      }
    } catch (error) {
      throw new UnauthorizedException({ message: "Не веный Email или пароль" });
    }
  }
}