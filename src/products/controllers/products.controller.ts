import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@products/dtos/pagination.dto';
import { ProductsService } from '@products/services';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    description: 'Find products with filtering',
  })
  @ApiOkResponse({
    description: 'Find products',
  })
  getProducts(@Query() pagination: PaginationDto) {
    return this.productsService.find(pagination);
  }
}
