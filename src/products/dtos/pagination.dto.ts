import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 5, description: 'Number of items to take' })
  @IsNumber()
  @IsOptional()
  @Max(5, { message: 'max page size is 5' })
  @Expose()
  limit: number = 5;

  @ApiPropertyOptional({ default: 1, description: 'Page of items' })
  @IsNumber()
  @IsOptional()
  @Expose()
  page?: number;

  @ApiPropertyOptional({ description: 'Name filter' })
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ description: 'Category filter' })
  @IsString()
  @IsOptional()
  @Expose()
  category?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsNumber()
  @Min(0, { message: 'Price must be positive' })
  @IsOptional()
  @Expose()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Min(0, { message: 'Price must be positive' })
  maxPrice?: number;
}
