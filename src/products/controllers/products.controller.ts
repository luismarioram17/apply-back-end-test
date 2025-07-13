import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductsService } from '@products/services';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: UpdateProductsService) {}

  @Get('fetch')
  fetchProducts() {}
}
