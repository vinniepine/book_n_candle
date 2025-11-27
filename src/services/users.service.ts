import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { Role, User } from '../models/entities';

@Injectable()
export class UsersService {
  constructor(private readonly db: DataStoreService) {}

  findAll(query?: { email?: string; name?: string }) {
    const { email, name } = query || {};
    return this.db.users.filter((user) => {
      const emailMatch = email ? user.email.toLowerCase().includes(email.toLowerCase()) : true;
      const nameMatch = name ? user.name.toLowerCase().includes(name.toLowerCase()) : true;
      return emailMatch && nameMatch;
    });
  }

  findById(id: string) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  update(id: string, payload: Partial<Pick<User, 'name' | 'email' | 'address' | 'phone'>>) {
    const user = this.findById(id);
    Object.assign(user, payload, { updatedAt: new Date().toISOString() });
    this.db.upsertUser(user);
    this.db.log('user_updated', id, { fields: Object.keys(payload) });
    return user;
  }

  delete(id: string) {
    const index = this.db.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Usuário não encontrado');
    this.db.users.splice(index, 1);
    this.db.log('user_deleted', id);
  }

  elevate(id: string, role: Role) {
    const user = this.findById(id);
    user.role = role;
    user.updatedAt = new Date().toISOString();
    this.db.upsertUser(user);
    this.db.log('user_role_updated', id, { role });
    return user;
  }
}
