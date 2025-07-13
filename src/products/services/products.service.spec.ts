import {
  generateMockProduct,
  generateMockProducts,
} from '@common/mocks/products.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductDto } from '@products/dtos';
import { Product } from '@products/entities';
import { ProductsService } from '@products/services';
import { Repository } from 'typeorm';

const cleanDates = (obj: {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}) => {
  const { createdAt: _c, updatedAt: _u, ...noDates } = obj;

  return noDates;
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeEach(async () => {
      await repository.clear();
    });

    it('should create products', async () => {
      const productToInsert: CreateProductDto =
        generateMockProduct() as Product;

      const result = await service.create(productToInsert);

      expect(result).toEqual(productToInsert);

      const savedProduct = await repository.findOneBy({
        id: productToInsert.id,
      });

      expect(savedProduct).toBeDefined();

      const savedNoDates = cleanDates(savedProduct || {});
      const productToInsertNoDates = cleanDates(productToInsert);

      expect(savedNoDates).toEqual(productToInsertNoDates);
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await repository.clear();

      const products = generateMockProducts(10);

      await repository.save(products);
    });

    it('should return maximum of 5 products', async () => {
      const products = await service.find({
        limit: 5,
      });

      expect(products.items.length).toBe(5);

      expect(products.meta.currentPage).toBe(1);
      expect(products.meta.itemsPerPage).toBe(5);
      expect(products.meta.totalItems).toBe(10);
    });

    it('should filter by category name', async () => {
      const filterableProducts: Product[] = await repository.save(
        generateMockProducts(2).map((product) => ({
          ...product,
          category: 'Smart Watch',
        })),
      );

      const results = await service.find({
        category: 'Smart Watch',
        limit: 5,
      });

      expect(results.items.length).toBe(2);
      expect(results.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...cleanDates(filterableProducts[0]),
          }),
          expect.objectContaining({
            ...cleanDates(filterableProducts[1]),
          }),
        ]) as unknown,
      );
    });

    it('should filter items by name', async () => {
      const filterableProducts: Product[] = await repository.save(
        generateMockProducts(2).map((product) => ({
          ...product,
          name: 'Smart Watch',
        })),
      );

      const results = await service.find({
        name: 'Smart Watch',
        limit: 5,
      });

      expect(results.items.length).toBe(2);
      expect(results.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...cleanDates(filterableProducts[0]),
          }),
          expect.objectContaining({
            ...cleanDates(filterableProducts[1]),
          }),
        ]) as unknown,
      );
    });

    it('should return only products with price under max price', async () => {
      await repository.clear();

      const threshold = 100;

      await repository.save({
        ...generateMockProduct(),
        price: threshold - 10,
      });

      await repository.save({
        ...generateMockProduct(),
        price: threshold + 10,
      });

      const result = await service.find({
        limit: 5,
        maxPrice: threshold,
      });

      expect(result.items.length).toBe(1);
      expect(result.items[0].price).toBeLessThanOrEqual(threshold);
    });

    it('should return products within minPrice and maxPrice range', async () => {
      await repository.clear();

      const min = 50;
      const max = 150;

      await repository.save({
        ...generateMockProduct(),
        price: 100,
      });

      await repository.save({
        ...generateMockProduct(),
        price: 40,
      });

      await repository.save({
        ...generateMockProduct(),
        price: 160,
      });

      const result = await service.find({
        limit: 5,
        minPrice: min,
        maxPrice: max,
      });

      expect(result.items.length).toBe(1);
      expect(result.items[0].price).toBeGreaterThanOrEqual(min);
      expect(result.items[0].price).toBeLessThanOrEqual(max);
    });

    it('should filter by category, name, minPrice, and maxPrice together', async () => {
      await repository.clear();

      // Products that should match all filters
      const matchingProducts = await repository.save([
        {
          ...generateMockProduct(),
          category: 'Wearable',
          name: 'Smart Watch',
          price: 120,
        },
        {
          ...generateMockProduct(),
          category: 'Wearable',
          name: 'Smart Watch',
          price: 130,
        },
      ]);

      // Products that should NOT match (wrong category)
      await repository.save({
        ...generateMockProduct(),
        category: 'Phone',
        name: 'Smart Watch',
        price: 125,
      });

      // Products that should NOT match (wrong name)
      await repository.save({
        ...generateMockProduct(),
        category: 'Wearable',
        name: 'Fitness Tracker',
        price: 125,
      });

      // Products that should NOT match (price too low)
      await repository.save({
        ...generateMockProduct(),
        category: 'Wearable',
        name: 'Smart Watch',
        price: 90,
      });

      // Products that should NOT match (price too high)
      await repository.save({
        ...generateMockProduct(),
        category: 'Wearable',
        name: 'Smart Watch',
        price: 200,
      });

      const result = await service.find({
        category: 'Wearable',
        name: 'Smart Watch',
        minPrice: 100,
        maxPrice: 150,
        limit: 10,
      });

      expect(result.items.length).toBe(2);
      expect(result.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining(cleanDates(matchingProducts[0])),
          expect.objectContaining(cleanDates(matchingProducts[1])),
        ]),
      );
    });
  });

  describe('findOne', () => {
    let products: Partial<Product>[];
    beforeEach(async () => {
      await repository.clear();

      products = generateMockProducts(2);

      await repository.save(products);
    });

    it('should return a product in the database', async () => {
      const storedProduct = await repository.save(generateMockProduct());

      const result = await service.findOne(storedProduct.id);

      const [resultNoDates, storedProductNoDates] = [result, storedProduct].map(
        cleanDates,
      );

      expect(resultNoDates).toEqual(storedProductNoDates);
    });

    it('should return only products with price over min price', async () => {
      await repository.clear();

      const threshold = 100;

      const _overPrice = await repository.save({
        ...generateMockProduct(),
        price: threshold + 10,
      });

      const _underPrice = await repository.save({
        ...generateMockProduct(),
        price: threshold - 10,
      });

      const result = await service.find({
        limit: 5,
        minPrice: threshold,
      });

      expect(result.items.length).toBe(1);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await repository.clear();
    });

    it('should delete a product', async () => {
      const temporaryProduct = await repository.save(generateMockProduct());

      await service.delete(temporaryProduct.id);

      const result = await repository.findOneBy({ id: temporaryProduct.id });

      expect(result).toBeNull();
    });
  });
});
