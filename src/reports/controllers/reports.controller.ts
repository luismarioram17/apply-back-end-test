import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '@reports/services';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('product-stats')
  async getProductStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const stats = await this.reportsService.getProductStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return stats;
  }
}
