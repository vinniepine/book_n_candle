import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { randomBytes, pbkdf2Sync } from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { DataStoreService } from './data-store.service';
import { Role, User } from '../models/entities';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-book-n-candle';
const HASH_ITERATIONS = 100000;
const HASH_KEYLEN = 64;
const HASH_ALGO = 'sha512';

@Injectable()
export class AuthService {
  constructor(private readonly db: DataStoreService) {}

  private hashPassword(password: string, salt: string) {
    const derived = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_ALGO);
    return derived.toString('hex');
  }

  register(name: string, email: string, password: string, role: Role = 'user') {
    const normalizedEmail = email.toLowerCase();
    if (this.db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    const now = new Date().toISOString();
    const salt = randomBytes(16).toString('hex');
    const user: User = {
      id: uuid(),
      name,
      email: normalizedEmail,
      salt,
      passwordHash: this.hashPassword(password, salt),
      role,
      createdAt: now,
      updatedAt: now,
    };
    this.db.upsertUser(user);
    this.db.log('user_registered', user.id, { email: user.email });
    return user;
  }

  seedAdminPassword(password: string) {
    const admin = this.db.users.find((u) => u.role === 'admin');
    if (admin && !admin.passwordHash) {
      admin.salt = randomBytes(16).toString('hex');
      admin.passwordHash = this.hashPassword(password, admin.salt);
      admin.updatedAt = new Date().toISOString();
      this.db.log('admin_seeded', admin.id);
    }
  }

  validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const user = this.db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const passwordHash = this.hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  login(email: string, password: string) {
    const user = this.validateUser(email, password);
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    this.db.log('user_login', user.id);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  decodeToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { sub: string; role: Role; email: string };
  }
}
