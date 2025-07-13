jest.mock('contentful', () => ({
  createClient: jest.fn(() => ({
    getEntries: jest.fn().mockResolvedValue({ items: [] }),
    getEntry: jest.fn().mockResolvedValue({ fields: { title: 'Mock title' } }),
  })),
}));

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
  });

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
    beforeEach(async () => {});
  });
});
