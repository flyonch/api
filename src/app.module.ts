import { Module } from "@nestjs/common";
import { DbService } from './db/db.service'; 
import { postgresProvider } from './db/postgres.provider'
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { UserService } from "./users/users.service";
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';



@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    DbService,
    postgresProvider
  ],
  imports: [ConfigModule.forRoot({
    envFilePath: '.env'
  }), DbModule, AuthModule, 
],
  
})
export class AppModule {}
