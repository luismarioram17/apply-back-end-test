import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@products/controllers';
import { UpdateProductsService } from '@products/services';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UpdateProductsService, useValue: {} }],
      controllers: [ProductsController],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
