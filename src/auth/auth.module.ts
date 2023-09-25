import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbService } from 'src/db/db.service';
import { postgresProvider } from 'src/db/postgres.provider';
import { ValidationPipe } from "@nestjs/common";
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  providers: [AuthService, DbService, postgresProvider, ValidationPipe],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "KEY_KEY_KEY",
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  exports: [
    AuthService, JwtModule 
  ]
})
export class AuthModule {}
