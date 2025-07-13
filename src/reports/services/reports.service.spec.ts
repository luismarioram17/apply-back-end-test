import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '@products/entities';
import { ReportsService } from '@reports/services';
import { Repository } from 'typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let repo: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate all percentages correctly', async () => {
    repo.count
      .mockResolvedValueOnce(10) // lowStock
      .mockResolvedValueOnce(100) // total
      .mockResolvedValueOnce(20) // deleted
      .mockResolvedValueOnce(5) // withoutPrice
      .mockResolvedValueOnce(15); // withinRange

    const result = await service.getProductStats(
      new Date('2025-01-01'),
      new Date('2025-12-31'),
    );
    expect(result).toEqual({
      percentageDeleted: '20.00%',
      percentageWithoutPrice: '6.25%',
      percentageWithinRange: '18.75%',
      percentageLowStock: '12.50%',
    });
  });

  it('should handle zero total products', async () => {
    repo.count.mockResolvedValue(0);
    const result = await service.getProductStats();
    expect(result).toEqual({
      percentageDeleted: '0.00%',
      percentageWithoutPrice: '0.00%',
      percentageWithinRange: '0.00%',
      percentageLowStock: '0.00%',
    });
  });
});
