import { faker } from '@faker-js/faker/.';
import { Product } from '@products/entities';

export const generateMockProduct: () => Partial<Product> = () => ({
  id: faker.string.alphanumeric({
    casing: 'mixed',
    length: 10,
  }),
  sku: faker.string.alphanumeric({
    length: 8,
    casing: 'upper',
  }),
  name: faker.commerce.product(),
  brand: faker.company.name(),
  category: faker.commerce.product(),
  color: faker.color.human(),
  createdAt: new Date(),
  updatedAt: new Date(),
  currency: 'USD',
  price: +(Math.random() * 100).toFixed(2),
  model: faker.company.name(),
  stock: Math.floor(Math.random() * 1000),
});

export const generateMockProducts: (cant: number) => Partial<Product>[] = (
  cant: number,
) =>
  Array.from(
    {
      length: cant,
    },
    generateMockProduct,
  );
