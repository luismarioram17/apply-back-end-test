import { ContentfulModule } from '@contentful/contentful.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entities';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ContentfulSource } from './sources/contentful.source';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ContentfulModule],
  providers: [ProductsService, ContentfulSource],
  controllers: [ProductsController],
})
export class ProductsModule {}
