import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@products/controllers';
import { ProductsService } from '@products/services';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockService = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should call service with pagination', async () => {
      const paginationDto = {
        limit: 5,
        page: 1,
      };

      mockService.find.mockResolvedValue({
        items: [],
      });

      const result = await controller.getProducts(paginationDto);

      expect(result).toEqual({
        items: [],
      });
      expect(mockService.find).toHaveBeenCalledWith(paginationDto);
    });
  });
});
