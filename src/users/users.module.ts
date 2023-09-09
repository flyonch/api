import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, DbService],
  exports: [
    UserService
  ]
})
export class UsersModule {}
