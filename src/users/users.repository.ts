import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['pokemons'] });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['pokemons']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return !!result.affected;
  }

  // Métodos para pokemones
  async addPokemonToUser(userId: number, pokemonId: number, name: string): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create({
      userId,
      pokemonId,
      name,
    });
    return this.pokemonRepository.save(pokemon);
  }

  async removePokemonFromUser(userId: number, pokemonId: number): Promise<boolean> {
    const result = await this.pokemonRepository.delete({
      userId,
      pokemonId,
    });
    return !!result.affected;
  }

  async getUserPokemons(userId: number): Promise<Pokemon[]> {
    return this.pokemonRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async hasPokemon(userId: number, pokemonId: number): Promise<boolean> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { userId, pokemonId },
    });
    return !!pokemon;
  }
}

