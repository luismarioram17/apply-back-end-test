import {
  Column,
  ColumnType,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

export const timestampType: () => ColumnType = () => {
  return process.env.NODE_ENV === 'test' ? 'text' : 'timestamp';
};

@Entity()
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @Column({ type: timestampType(), nullable: true })
  createdAt?: Date;

  @Column({ type: timestampType(), nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
