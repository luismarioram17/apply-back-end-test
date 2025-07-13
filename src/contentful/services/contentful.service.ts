import {
  ContentfulItemDto,
  ContentfulResponseDto,
} from '@contentful/dtos/contentful-response.dto';
import { FiltersDto } from '@contentful/dtos/filters.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as contentful from 'contentful';

/**
 * Service for interacting with the Contentful CMS API.
 */
@Injectable()
export class ContentfulService {
  private client: contentful.ContentfulClientApi<undefined>;

  /**
   * Initializes the Contentful client using configuration values.
   * @param configService - The NestJS ConfigService for accessing environment variables.
   */
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

  /**
   * Fetches content entries of a given type from Contentful, with optional date filters.
   *
   * @template T - The type of the contentful entry fields.
   * @param {string} type - The content type to fetch.
   * @param {FiltersDto} [filters] - Optional filters for creation date range.
   * @returns {Promise<ContentfulResponseDto<T>>} The fetched contentful entries and metadata.
   */
  async getContent<T>(
    type: string,
    filters?: FiltersDto,
  ): Promise<ContentfulResponseDto<T>> {
    const contentfulFilters: contentful.EntriesQueries<
      contentful.EntrySkeletonType,
      undefined
    > = {
      content_type: type,
    };

    const {
      creationStartDate: updateStartDateTime,
      creationEndDate: updateEndDateTime,
    } = filters || {};

    if (updateStartDateTime) {
      contentfulFilters['sys.createdAt[gt]'] =
        updateStartDateTime.toISOString();
    }

    if (updateEndDateTime) {
      contentfulFilters['sys.createdAt[lt]'] = updateEndDateTime.toISOString();
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
