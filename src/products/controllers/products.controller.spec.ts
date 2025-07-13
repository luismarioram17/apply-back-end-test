import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@products/controllers';
import { ProductsService } from '@products/services';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockService = {
    find: jest.fn(),
    delete: jest.fn(),
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

  describe('deleteProduct', () => {
    it('should call service with id and return result', async () => {
      const id = 'test-id';
      const expectedResult = { success: true };
      mockService.delete.mockResolvedValue(expectedResult);

      const result = await controller.deleteProduct(id);

      expect(result).toBe(expectedResult);
      expect(mockService.delete).toHaveBeenCalledWith(id);
    });
  });
});
