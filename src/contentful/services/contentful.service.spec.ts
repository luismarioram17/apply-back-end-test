jest.mock('contentful', () => {
  const mockClient = {
    getEntries: jest.fn().mockResolvedValue({ items: [] }),
    getEntry: jest.fn().mockResolvedValue({ fields: { title: 'Mock title' } }),
  };

  return {
    createClient: jest.fn(() => mockClient),
  };
});

import {
  mockContentfulItems,
  MockContentfulItemType,
  mockContentfulResponse,
} from '@common/mocks/contentful.mock';
import { ContentfulService } from '@contentful/services';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as contentful from 'contentful';

describe('ContentfulService', () => {
  let service: ContentfulService;

  const mockContentfulClient = contentful.createClient({
    accessToken: 'default',
    space: 'default',
    environment: 'master',
  }) as unknown as {
    getEntries: jest.Mock;
  };

  const mockConfig = {
    get: jest.fn().mockImplementation((key: string, defaultValue: string) => {
      const lib = {
        ['CONTENTFUL_ACCESS_TOKEN']: 'default',
        ['CONTENTFUL_SPACE_ID']: 'default',
        ['CONTENTFUL_ENVIRONMENT']: 'master',
      };

      return `${lib[key] || defaultValue}`;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContent', () => {
    let contentfulEntries: MockContentfulItemType[];

    beforeEach(() => {
      contentfulEntries = mockContentfulItems(2);
    });

    it('should return entries from contentful sdk', async () => {
      const mockResponse = mockContentfulResponse(2);
      mockResponse.items = contentfulEntries;

      mockContentfulClient.getEntries.mockResolvedValue(mockResponse);

      const result = await service.getContent('mock');
      expect(result.items).toEqual(contentfulEntries);
    });

    it('should filter entries with before date if passed', async () => {
      contentfulEntries[0].sys.updatedAt = new Date(
        '2025-07-12T00:00:00',
      ).toISOString();

      contentfulEntries[1].sys.updatedAt = new Date(
        '2025-07-14T00:00:00',
      ).toISOString();

      const beforeDateFilter = new Date('2025-07-13T00:00:00');

      const mockResponse = mockContentfulResponse(1);

      mockResponse.items = [contentfulEntries[1]];

      mockContentfulClient.getEntries.mockResolvedValueOnce(mockResponse);

      const result = await service.getContent('mock', {
        creationStartDate: beforeDateFilter,
      });

      expect(result.items).toEqual([contentfulEntries[1]]);
      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'mock',
        'sys.createdAt[gt]': beforeDateFilter.toISOString(),
      });
    });

    it('should filter entries with after date if passed', async () => {
      contentfulEntries[0].sys.updatedAt = new Date(
        '2025-07-16T00:00:00',
      ).toISOString();

      contentfulEntries[1].sys.updatedAt = new Date(
        '2025-07-11T00:00:00',
      ).toISOString();

      const afterDateFilter = new Date('2025-07-14T00:00:00');

      const mockResponse = mockContentfulResponse(1);

      mockResponse.items = [contentfulEntries[1]];

      mockContentfulClient.getEntries.mockResolvedValue(mockResponse);

      const result = await service.getContent('mock', {
        creationEndDate: afterDateFilter,
      });

      expect(result.items).toEqual([contentfulEntries[1]]);

      expect(mockContentfulClient.getEntries).toHaveBeenCalledWith({
        content_type: 'mock',
        'sys.createdAt[lt]': afterDateFilter.toISOString(),
      });
    });
  });
});
