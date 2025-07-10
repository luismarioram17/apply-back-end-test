import { config } from 'dotenv';

config();

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  seeds: [__dirname + '/**/*.seed{.ts,.js}'],
  factories: [__dirname + '/**/*.factory{.ts,.js}'],
};
