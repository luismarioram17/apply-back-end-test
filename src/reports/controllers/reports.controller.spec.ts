import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '@reports/controllers';
import { ReportsService } from '@reports/services';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockStats = {
    percentageDeleted: 10,
    percentageWithoutPrice: 5,
    percentageWithinRange: 2,
    percentageLowStock: 3,
  };

  const mockReportsService = {
    getProductStats: jest.fn().mockResolvedValue(mockStats),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockReportsService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return product stats from service', async () => {
    const result = await controller.getProductStats('2025-01-01', '2025-12-31');
    expect(service['getProductStats']).toHaveBeenCalledWith(
      new Date('2025-01-01'),
      new Date('2025-12-31'),
    );
    expect(result).toEqual(mockStats);
  });
});
