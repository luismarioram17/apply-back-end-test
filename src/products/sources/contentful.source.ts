import { ContentfulService } from '@contentful/services';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateProductDto } from '@products/dtos';
import { ProductsService } from '@products/services';

@Injectable()
export class ContentfulSource implements OnModuleInit {
  async onModuleInit() {
    await this.fillInitialProducts();
  }
  /**
   * Fetch all products from Contentful and insert only new ones into the database.
   * Call this method on server start to initially fill the data.
   */
  async fillInitialProducts() {
    console.log('🔎 Fetching all products for initial fill...');
    const allContent =
      await this.contentfulService.getContent<CreateProductDto>('product');
    const allItems = allContent.items;

    const productDtos: CreateProductDto[] = allItems.map((item) => ({
      ...item.fields,
      id: item.sys.id,
      createdAt: new Date(item.sys.createdAt),
      updatedAt: new Date(item.sys.updatedAt),
    }));

    // Check which products already exist
    const existingProducts = await this.productsService.find({
      limit: allItems.length,
    });
    const existingIds = new Set(existingProducts.items.map((p) => p.id));

    const newProductDtos = productDtos.filter(
      (dto) => !existingIds.has(dto.id),
    );

    if (newProductDtos.length === 0) {
      console.log('No new products to insert.');
      return;
    }

    const results = await Promise.allSettled(
      newProductDtos.map((productDto) =>
        this.productsService.create(productDto),
      ),
    );

    const succeeded = results.filter((result) => result.status === 'fulfilled');
    const failed = results.filter((result) => result.status === 'rejected');

    if (failed.length) {
      console.error(`Failed inserting ${failed.length} products.`);
    } else {
      console.log(`Succeeded inserting ${succeeded.length} new products.`);
    }
  }
  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Create last hour's products
   */
  @Cron(CronExpression.EVERY_HOUR)
  async createProducts() {
    const threshold = new Date();
    threshold.setHours(threshold.getHours() - 1, 0, 0, 0);

    console.log('🔎 Fetching latest content...');

    const latestContent =
      await this.contentfulService.getContent<CreateProductDto>('product', {
        creationStartDate: threshold,
      });

    const latestItems = latestContent.items;

    const productDtos: CreateProductDto[] = latestItems.map((item) => ({
      ...item.fields,
      id: item.sys.id,
      createdAt: new Date(item.sys.createdAt),
      updatedAt: new Date(item.sys.updatedAt),
    }));

    const results = await Promise.allSettled(
      productDtos.map((productDto) => this.productsService.create(productDto)),
    );

    const succeeded = results.filter((result) => result.status === 'fulfilled');
    const failed = results.filter((results) => results.status === 'rejected');

    if (failed.length) {
      console.error(`Failed inserting ${failed.length}`);
    } else {
      console.log(`Succeeded inserting ${succeeded.length}`);
    }
  }
}
