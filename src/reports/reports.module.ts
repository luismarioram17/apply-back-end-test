import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entities';
import { ReportsController } from '@reports/controllers';
import { ReportsService } from '@reports/services';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
