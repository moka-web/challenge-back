import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';

const dataSourceOptions: DataSourceOptions = {

  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'users_db',
  entities: [User],
  
  migrations: ['dist/database/migrations/**/*.js'],
  migrationsTableName: 'migrations_history',

  synchronize: process.env.NODE_ENV !== 'production',
  
};

export const AppDataSource = new DataSource(dataSourceOptions);

