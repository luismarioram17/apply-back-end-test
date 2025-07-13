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
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      repository.clear();

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
  });
});
