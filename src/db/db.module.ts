import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { PG_CONNECTION, postgresProvider } from './postgres.provider';

@Module({
  providers: [DbService, postgresProvider],
  exports: [DbService],
})
export class DbModule {}
