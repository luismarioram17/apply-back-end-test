import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, PaginationDto } from '@products/dtos';
import { Product } from '@products/entities';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

/**
 * Service for managing products, including creation, filtering, retrieval, and deletion.
 */
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
  /**
   * Create a new product in the database.
   * @param dto - Data Transfer Object containing product details.
   * @returns The saved product entity.
   */
  async create(dto: CreateProductDto) {
    return this.productRepository.save(dto);
  }

  /**
   * Find products applying filters
   * @param pagination - PaginationDto
   * @returns
   */
  /**
   * Find products applying optional filters and pagination.
   * @param pagination - Pagination and filter options.
   * @returns Paginated list of products matching the filters.
   */
  async find(pagination: PaginationDto): Promise<Pagination<Product>> {
    const { limit, page, category, name, maxPrice, minPrice } = pagination;

    const qb = this.productRepository.createQueryBuilder('product');

    if (category) {
      qb.andWhere('LOWER(product.category) LIKE :category', {
        category: `%${category.toLowerCase()}%`,
      });
    }

    if (name) {
      qb.andWhere('LOWER(product.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (minPrice) {
      qb.andWhere('product.price >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice) {
      qb.andWhere('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    return paginate(qb, {
      page: page || 1,
      limit: limit || 5,
    });
  }

  /**
   * Find a single product by its ID.
   * @param id - The product ID.
   * @throws NotFoundException if the product does not exist.
   * @returns The found product entity.
   */
  async findOne(id: string) {
    const result = await this.productRepository.findOneBy({
      id,
    });

    if (!result) throw new NotFoundException('Product not found');

    return result;
  }

  /**
   * Soft delete a product by its ID.
   * @param id - The product ID to delete.
   * @throws NotFoundException if the product does not exist.
   */
  async delete(id: string) {
    const toDelete = await this.findOne(id);
    await this.productRepository.softDelete(toDelete.id);
  }
}
