import { Injectable } from '@nestjs/common';
import { DataStoreService } from './data-store.service';

@Injectable()
export class LogsService {
  constructor(private readonly db: DataStoreService) {}

  list() {
    return this.db.logs;
  }
}
