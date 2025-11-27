import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, Roles } from '../decorators/auth.decorator';
import { ProductDto } from '../dto/product.dto';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get()
  list(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
  ) {
    return this.products.findAll({ category, search, minPrice, maxPrice, sort });
  }

  @Roles('admin')
  @Post()
  create(@Body() body: ProductDto) {
    return this.products.create(body);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ProductDto>) {
    return this.products.update(id, body);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.products.delete(id);
    return { success: true };
  }
}
