import { ContentfulService } from '@contentful/services';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RawProductDto } from '@products/dtos/raw-product.dto';

@Injectable()
/**
 * Class in charge of keeping the products database updated,
 * it runs an update process hourly and checks which
 */
export class UpdateProductsService {
  constructor(private readonly contentfulService: ContentfulService) {}

  @Cron('0 0 * * * *')
  async fetchData() {
    const fromTime = new Date();
    fromTime.setMinutes(0, 0, 0);
    fromTime.setHours(fromTime.getHours() - 1);

    console.log('🔎 Fetching data from contentful...');

    const data = await this.contentfulService.getContent<RawProductDto>(
      'product',
      {
        updateStartDateTime: fromTime,
      },
    );

    console.info(`... ${data.items.length} new records `);
  }
}
