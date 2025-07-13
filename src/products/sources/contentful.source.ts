import { ContentfulService } from '@contentful/services';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateProductDto } from '@products/dtos/create-product.dto';
import { ProductsService } from '@products/services';

@Injectable()
export class ContentfulSource {
  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly productsService: ProductsService,
  ) {}

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
