import { timestampType } from '@common/db/types.db';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({ type: 'float' })
  price: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @Column({ type: timestampType() })
  createdAt: Date;

  @Column({ type: timestampType() })
  updatedAt: Date;
}
