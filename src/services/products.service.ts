import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataStoreService } from './data-store.service';
import { Product } from '../models/entities';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DataStoreService) {}

  findAll(filters: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }) {
    let products = [...this.db.products];
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.sort === 'popular') {
      products = products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    if (filters.sort === 'new') {
      products = products.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return products;
  }

  create(payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'popularity'>) {
    const now = new Date().toISOString();
    const product: Product = {
      ...payload,
      id: uuid(),
      popularity: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.db.products.push(product);
    this.db.log('product_created', undefined, { productId: product.id });
    return product;
  }

  update(id: string, payload: Partial<Product>) {
    const product = this.db.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    Object.assign(product, payload, { updatedAt: new Date().toISOString() });
    this.db.log('product_updated', undefined, { productId: id });
    return product;
  }

  delete(id: string) {
    const index = this.db.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Produto não encontrado');
    this.db.products.splice(index, 1);
    this.db.log('product_deleted', undefined, { productId: id });
  }
}
