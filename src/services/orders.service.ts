import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataStoreService } from './data-store.service';
import { Order, OrderStatus } from '../models/entities';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DataStoreService) {}

  list(userId: string, role: string, filters?: { status?: OrderStatus }) {
    let orders = this.db.orders;
    if (role !== 'admin') {
      orders = orders.filter((o) => o.userId === userId);
    }
    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }
    return orders;
  }

  create(userId: string, items: { productId: string; quantity: number }[]) {
    const now = new Date().toISOString();
    const enrichedItems = items.map((item) => {
      const product = this.db.products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException('Produto não encontrado');
      return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
    });
    const total = enrichedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const order: Order = {
      id: uuid(),
      userId,
      items: enrichedItems,
      status: 'placed',
      total,
      createdAt: now,
      updatedAt: now,
    };
    this.db.orders.push(order);
    this.db.log('order_created', userId, { orderId: order.id });
    return order;
  }

  updateStatus(orderId: string, status: OrderStatus, actorRole: string) {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (actorRole !== 'admin' && actorRole !== 'operator' && status !== 'cancelled') {
      throw new ForbiddenException('Ação não permitida');
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.db.log('order_status_updated', undefined, { orderId, status });
    return order;
  }
}
