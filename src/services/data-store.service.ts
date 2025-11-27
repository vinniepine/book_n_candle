import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { LogEntry, Order, Product, SupportMessage, User } from '../models/entities';

@Injectable()
export class DataStoreService {
  users: User[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  messages: SupportMessage[] = [];
  logs: LogEntry[] = [];

  constructor() {
    const now = new Date().toISOString();
    this.users.push({
      id: uuid(),
      name: 'Admin Seed',
      email: 'admin@bookncandle.io',
      passwordHash: '',
      salt: '',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });
    this.products.push(
      {
        id: uuid(),
        name: 'Vela de Proteção',
        description: 'Vela aromática com ervas para limpeza energética.',
        price: 35.9,
        category: 'velas',
        tags: ['proteção', 'aromática'],
        stock: 50,
        popularity: 15,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Incenso Mirra',
        description: 'Incenso artesanal de mirra para rituais de gratidão.',
        price: 18.5,
        category: 'incensos',
        tags: ['mirra', 'gratidão'],
        stock: 100,
        popularity: 40,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Kit Lavanda Astral',
        description: 'Bruma energética, vela lilás e quartzo leitoso para rituais noturnos.',
        price: 79.9,
        category: 'kits',
        tags: ['calma', 'relaxamento'],
        stock: 25,
        popularity: 55,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Grimório Ilustrado',
        description: 'Caderno pontilhado com capa de constelações douradas para estudos e registros.',
        price: 54.5,
        category: 'livros',
        tags: ['anotações', 'rituais'],
        stock: 70,
        popularity: 22,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Spray Aura Doce',
        description: 'Blend de laranja doce e canela em spray para harmonizar ambientes.',
        price: 42.0,
        category: 'aromaterapia',
        tags: ['abundância', 'energização'],
        stock: 80,
        popularity: 33,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Pingente Olho Grego',
        description: 'Pingente esmaltado com fio dourado para proteção diária.',
        price: 29.9,
        category: 'acessórios',
        tags: ['proteção', 'amuleto'],
        stock: 120,
        popularity: 48,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        name: 'Baralho Tarot Iniciante',
        description: 'Tarot clássico com guia rápido em português e bordas holográficas.',
        price: 98.0,
        category: 'tarot',
        tags: ['guias', 'divinação'],
        stock: 35,
        popularity: 60,
        createdAt: now,
        updatedAt: now,
      },
    );
  }

  upsertUser(user: User) {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  log(action: string, actorId?: string, metadata?: Record<string, unknown>) {
    this.logs.push({
      id: uuid(),
      action,
      actorId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  }
}
