import { faker } from '@faker-js/faker';

export type MockContentfulItemType = {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: Record<string, any>;
};

export const mockContentfulItem = () => ({
  sys: {
    id: faker.string.alphanumeric({
      length: 10,
      casing: 'mixed',
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  fields: {},
});

export const mockContentfulItems = (cant: number) =>
  Array.from({ length: cant }, mockContentfulItem);

export const mockContentfulResponse = (cant: number) => ({
  sys: {
    type: 'Array',
  },

  total: cant,
  skip: 0,
  limit: 100,
  items: mockContentfulItems(cant),
});
