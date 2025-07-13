import { UseJwtGuard } from '@auth/guards/jwt-auth.guard';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '@reports/services';

@ApiBearerAuth('jwt')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('product-stats')
  @UseJwtGuard()
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
