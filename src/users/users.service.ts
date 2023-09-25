import { BadRequestException, Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { UserModel } from "./models/create-user.model";
import * as bcrypt from "bcrypt";
import { error } from "console";
import { UserAuthenticationModel } from "src/auth/model/auth-model";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DbService) {}

  async createUser(user: UserAuthenticationModel) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(user.password, saltOrRounds);

    const checkQuery = `
      SELECT COUNT(*) FROM public.users WHERE email = $1
    `;
    const checkValues = [user.email];

    const insertQuery = `
      INSERT INTO public.users (email, password)
      VALUES ($1, $2)
      RETURNING id, email; -- Вернуть все столбцы созданной записи
    `;
    const insertValues = [user.email, hash];

    try {
      // Начать транзакцию
      await this.databaseService.beginTransaction();

      // Проверка наличия пользователя
      const checkResult = await this.databaseService.query(
        checkQuery,
        checkValues
      );
      const userCount = checkResult.rows[0].count;

      if (userCount > 0) {
        // Если пользователь с такой почтой уже существует, откатить транзакцию и бросить ошибку
        await this.databaseService.rollbackTransaction();
        return {
          Status: "Error",
          Message: "Пользователь с такой почтой уже существует",
        };
      }

      // Создание нового пользователя и возврат созданной записи
      const createdUserResult = await this.databaseService.query(
        insertQuery,
        insertValues
      );

      // Завершить транзакцию
      await this.databaseService.commitTransaction();

      // Вернуть созданного пользователя вместе с сообщением об успешной операции
      return {
        Status: "Success",
        Message: "Пользователь успешно создан",
        Data: createdUserResult.rows[0], // Первая строка результата - созданный пользователь
      };
    } catch (error) {
      // Обработка ошибки и откат транзакции при необходимости
      console.error("Ошибка при создании пользователя:", error);
      await this.databaseService.rollbackTransaction();
      return {
        Status: "Error",
        Message: "Ошибка при создании пользователя",
      };
    }
  }

  async getUserById(userId: Number) {
    try {
      const query = `
        SELECT * FROM public.users WHERE id = $1
      `;
      const params = [userId];
      const result = await this.databaseService.query(query, params);
      return result.rows[0];
    } catch (err) {
      throw new BadRequestException("Пользователь не найден");
    }
  }

  async getUserByEmail(email: string) {
    try {
      const query = `
        SELECT * FROM public.users WHERE email = $1
      `;
      const params = [email];

      const result = await this.databaseService.query(query, params);

      if (result.rows.length > 0) {
        // Пользователь найден, возвращаем его
        return result.rows[0];
      } else {
        // Пользователь не найден, выбрасываем ошибку NotFoundException
        throw error;
      }
    } catch (error) {
      // Обработка других ошибок
      console.error("Ошибка при получении пользователя:", error);
      throw error;
    }
  }
}
