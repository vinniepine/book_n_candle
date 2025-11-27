import { Controller, Get } from '@nestjs/common';
import { Roles } from '../decorators/auth.decorator';
import { LogsService } from '../services/logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logs: LogsService) {}

  @Roles('admin')
  @Get()
  list() {
    return this.logs.list();
  }
}
