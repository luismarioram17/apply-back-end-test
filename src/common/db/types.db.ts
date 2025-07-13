import { ColumnType } from 'typeorm';

export const timestampType: () => ColumnType = () => {
  return process.env.NODE_ENV === 'test' ? 'text' : 'timestamp';
};
