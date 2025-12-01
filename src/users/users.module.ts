import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PokemonClient } from '../clients/pokemon.client';
import { User } from './entities/user.entity';
import { Pokemon } from './entities/pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Pokemon]),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PokemonClient],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

