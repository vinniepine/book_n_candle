import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from '../controllers/auth.controller';
import { UsersController } from '../controllers/users.controller';
import { ProductsController } from '../controllers/products.controller';
import { OrdersController } from '../controllers/orders.controller';
import { SupportController } from '../controllers/support.controller';
import { LogsController } from '../controllers/logs.controller';
import { DataStoreService } from '../services/data-store.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { ProductsService } from '../services/products.service';
import { OrdersService } from '../services/orders.service';
import { SupportService } from '../services/support.service';
import { LogsService } from '../services/logs.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [],
  controllers: [
    AuthController,
    UsersController,
    ProductsController,
    OrdersController,
    SupportController,
    LogsController,
  ],
  providers: [
    DataStoreService,
    AuthService,
    UsersService,
    ProductsService,
    OrdersService,
    SupportService,
    LogsService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
