import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
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

  @Delete(':id')
  @ApiOperation({
    description: 'Delete a product by ID',
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
  })
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
