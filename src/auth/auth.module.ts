import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/users/users.service';
import { DbService } from 'src/db/db.service';
import { PG_CONNECTION, postgresProvider } from 'src/db/postgres.provider';

@Module({
  providers: [AuthService, UserService, DbService, postgresProvider],
  controllers: [AuthController]
})
export class AuthModule {}
