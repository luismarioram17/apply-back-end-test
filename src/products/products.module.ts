import { ContentfulModule } from '@contentful/contentful.module';
import { Module } from '@nestjs/common';
import { ProductsController } from '@products/controllers';
import { UpdateProductsService } from '@products/services';

@Module({
  imports: [ContentfulModule],
  providers: [UpdateProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
