import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, PaginationDto } from '@products/dtos';
import { Product } from '@products/entities';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Create a product
   * @param dto - CreateProductDto
   * @returns
   */
  async create(dto: CreateProductDto) {
    return this.productRepository.save(dto);
  }

  /**
   * Find products applying filters
   * @param pagination - PaginationDto
   * @returns
   */
  async find(pagination: PaginationDto): Promise<Pagination<Product>> {
    const { limit, page, category, name, maxPrice, minPrice } = pagination;

    const qb = this.productRepository.createQueryBuilder('product');

    if (category) {
      qb.where('product.category ILIKE :category', {
        category: `%${category}%`,
      });
    }

    if (name) {
      qb.where('product.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    if (minPrice) {
      qb.where('product.price >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice) {
      qb.where('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    return paginate(qb, {
      page: page || 1,
      limit: limit || 5,
    });
  }
}
