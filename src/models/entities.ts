export type Role = 'user' | 'admin' | 'operator';
export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled' | 'returned';
export type MessageStatus = 'pending' | 'responded' | 'in_review';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: Role;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  tags?: string[];
  stock: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  subject: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface LogEntry {
  id: string;
  actorId?: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
