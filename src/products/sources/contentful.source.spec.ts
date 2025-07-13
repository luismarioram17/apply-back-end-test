import { ContentfulService } from '@contentful/services';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '@products/services';
import { ContentfulSource } from '@products/sources/contentful.source';

const mockProductsService = {
  create: jest.fn(),
  find: jest.fn(),
};

const mockContentfulService = {
  getContent: jest.fn(),
};

describe('ContentfulSource', () => {
  let source: ContentfulSource;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulSource,
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ContentfulService, useValue: mockContentfulService },
      ],
    }).compile();

    source = module.get<ContentfulSource>(ContentfulSource);
  });

  describe('fillInitialProducts', () => {
    it('should insert only new products', async () => {
      const items = [
        {
          fields: { name: 'A' },
          sys: { id: '1', createdAt: new Date(), updatedAt: new Date() },
        },
        {
          fields: { name: 'B' },
          sys: { id: '2', createdAt: new Date(), updatedAt: new Date() },
        },
      ];
      mockContentfulService.getContent.mockResolvedValue({ items });
      mockProductsService.find.mockResolvedValue({ items: [{ id: '1' }] });
      mockProductsService.create.mockResolvedValue({});

      await source.fillInitialProducts();

      expect(mockContentfulService.getContent).toHaveBeenCalledWith('product');
      expect(mockProductsService.create).toHaveBeenCalledTimes(1);
      expect(mockProductsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ id: '2', name: 'B' }),
      );
    });

    it('should not insert if all products exist', async () => {
      const items = [
        {
          fields: { name: 'A' },
          sys: { id: '1', createdAt: new Date(), updatedAt: new Date() },
        },
      ];
      mockContentfulService.getContent.mockResolvedValue({ items });
      mockProductsService.find.mockResolvedValue({ items: [{ id: '1' }] });

      await source.fillInitialProducts();
      expect(mockProductsService.create).not.toHaveBeenCalled();
    });
  });

  describe('createProducts', () => {
    it('should insert all fetched products', async () => {
      const items = [
        {
          fields: { name: 'A' },
          sys: { id: '1', createdAt: new Date(), updatedAt: new Date() },
        },
        {
          fields: { name: 'B' },
          sys: { id: '2', createdAt: new Date(), updatedAt: new Date() },
        },
      ];
      mockContentfulService.getContent.mockResolvedValue({ items });
      mockProductsService.create.mockResolvedValue({});

      await source.createProducts();

      expect(mockContentfulService.getContent).toHaveBeenCalledWith(
        'product',
        expect.any(Object),
      );
      expect(mockProductsService.create).toHaveBeenCalledTimes(2);
    });
  });
});
