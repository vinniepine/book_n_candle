import { IsArray, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class ProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsNumber()
  @Min(0)
  stock!: number;
}
