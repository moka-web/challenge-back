import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';


@Module({
  imports: [

    TypeOrmModule.forRoot({
      
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'users_db',
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production',
    }),

  ],

  exports: [TypeOrmModule],
})
export class DatabaseModule {}

