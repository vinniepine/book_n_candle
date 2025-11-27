import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';
import { OrdersService } from '../services/orders.service';
import { Roles } from '../decorators/auth.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Req() req: any, @Query('status') status?: string) {
    return this.orders.list(req.user.id, req.user.role, status ? { status: status as any } : undefined);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orders.create(req.user.id, body.items);
  }

  @Roles('admin', 'operator')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto, @Req() req: any) {
    return this.orders.updateStatus(id, body.status, req.user.role);
  }
}
