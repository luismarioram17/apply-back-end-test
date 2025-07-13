import {
  ContentfulItemDto,
  ContentfulResponseDto,
} from '@contentful/dtos/contentful-response.dto';
import { FiltersDto } from '@contentful/dtos/filters.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as contentful from 'contentful';

@Injectable()
export class ContentfulService {
  private client: contentful.ContentfulClientApi<undefined>;

  constructor(private readonly configService: ConfigService) {
    this.client = contentful.createClient({
      accessToken: this.configService.get<string>(
        'CONTENTFUL_ACCESS_TOKEN',
        'default',
      ),
      space: this.configService.get<string>('CONTENTFUL_SPACE_ID', 'default'),
      environment: this.configService.get<string>('CONTENTFUL_ENVIRONMENT'),
    });
  }

  async getContent<T>(
    type: string,
    filters: FiltersDto,
  ): Promise<ContentfulResponseDto<T>> {
    const contentfulFilters: contentful.EntriesQueries<
      contentful.EntrySkeletonType,
      undefined
    > = {
      content_type: type,
    };

    const { updateStartDateTime, updateEndDateTime } = filters;

    if (updateStartDateTime) {
      contentfulFilters['sys.updatedAt[gt]'] =
        updateStartDateTime.toISOString();
    }

    if (updateEndDateTime) {
      contentfulFilters['sys.udpatedAt[lt]'] = updateEndDateTime.toISOString();
    }

    const { total, items, limit } =
      await this.client.getEntries(contentfulFilters);

    return {
      total,
      limit,
      items: items as unknown[] as ContentfulItemDto<T>[],
    };
  }
}
