import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { DbService } from 'src/db/db.service';
import { AuthModule } from 'src/auth/auth.module';
import { postgresProvider } from 'src/db/postgres.provider';

@Module({
  controllers: [UsersController],
  providers: [UserService, DbService, postgresProvider],
  imports: [
     forwardRef(() => AuthModule)
  ],
  exports: [
    UserService
  ]
})
export class UsersModule {}
