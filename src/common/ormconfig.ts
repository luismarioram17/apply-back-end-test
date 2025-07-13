import { config } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
config();

const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_NAME || 'postgres',
  entities: ['{src,dist}/**/*.entity{.ts,.js}'],
};

export default ormconfig;
