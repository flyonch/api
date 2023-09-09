import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { PG_CONNECTION } from '../db/postgres.provider';

@Injectable()
export class DbService {
    constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

    async query(sql: string, values: any[] = []): Promise<QueryResult<any>> {
      return this.pool.query(sql, values);
    }
  
    async beginTransaction(): Promise<void> {
      await this.pool.query('BEGIN');
    }
  
    async commitTransaction(): Promise<void> {
      await this.pool.query('COMMIT');
    }
  
    async rollbackTransaction(): Promise<void> {
      await this.pool.query('ROLLBACK');
    }
  
}