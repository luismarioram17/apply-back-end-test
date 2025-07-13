import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@products/entities';
import { Between, IsNull, LessThan, Not, Repository } from 'typeorm';

/**
 * Service for generating product-related reports and statistics.
 */
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Get product statistics as percentages for deleted, without price, within date range, and low stock products.
   *
   * @param {Date} [startDate] - Optional start date for the within-range calculation.
   * @param {Date} [endDate] - Optional end date for the within-range calculation.
   * @returns {Promise<{ percentageDeleted: string; percentageWithoutPrice: string; percentageWithinRange: string; percentageLowStock: string; }>} JSON object with percentage strings for each metric.
   */
  async getProductStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    percentageDeleted: string;
    percentageWithoutPrice: string;
    percentageWithinRange: string;
    percentageLowStock: string;
  }> {
    const lowStock = await this.productRepository.count({
      where: { stock: LessThan(10) },
    });
    const total = await this.productRepository.count({ withDeleted: true });

    const deleted = await this.productRepository.count({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    const withoutPrice = await this.productRepository.count({
      where: { price: IsNull() },
    });

    let withinRange = 0;
    if (startDate && endDate) {
      withinRange = await this.productRepository.count({
        where: {
          createdAt: Between(startDate, endDate),
        },
      });
    }

    const active = total - deleted;

    const formatPercent = (value: number) => `${value.toFixed(2)}%`;
    return {
      percentageDeleted: formatPercent(total ? (deleted / total) * 100 : 0),
      percentageWithoutPrice: formatPercent(
        active ? (withoutPrice / active) * 100 : 0,
      ),
      percentageWithinRange: formatPercent(
        active ? (withinRange / active) * 100 : 0,
      ),
      percentageLowStock: formatPercent(active ? (lowStock / active) * 100 : 0),
    };
  }
}
