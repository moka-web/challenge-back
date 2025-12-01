import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { PokemonClient, PokeApiPokemon } from '../clients/pokemon.client';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly pokemonClient: PokemonClient,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException(`El email ${userData.email} ya está en uso`);
    }
    return this.usersRepository.create(userData);
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.usersRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new ConflictException(`El email ${userData.email} ya está en uso`);
      }
    }

    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  // Métodos para pokemones usando el cliente
  async addPokemonToUser(userId: number, pokemonIdOrName: number | string): Promise<{ pokemon: Pokemon; pokeApiData: PokeApiPokemon }> {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Obtener datos del pokemon de la PokeAPI usando el cliente
    const pokeApiData = typeof pokemonIdOrName === 'number'
      ? await this.pokemonClient.getPokemonById(pokemonIdOrName)
      : await this.pokemonClient.getPokemonByName(pokemonIdOrName);

    // Verificar si el usuario ya tiene este pokemon
    const hasPokemon = await this.usersRepository.hasPokemon(userId, pokeApiData.id);
    if (hasPokemon) {
      throw new ConflictException(`El usuario ya tiene el pokemon ${pokeApiData.name}`);
    }

    // Guardar referencia en la BD
    const pokemon = await this.usersRepository.addPokemonToUser(
      userId,
      pokeApiData.id,
      pokeApiData.name
    );

    return { pokemon, pokeApiData };
  }

  async removePokemonFromUser(userId: number, pokemonId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const deleted = await this.usersRepository.removePokemonFromUser(userId, pokemonId);
    if (!deleted) {
      throw new NotFoundException(`El usuario no tiene el pokemon con ID ${pokemonId}`);
    }
  }

  async getUserPokemons(userId: number): Promise<Pokemon[]> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return this.usersRepository.getUserPokemons(userId);
  }

  async getUserPokemonsWithDetails(userId: number): Promise<Array<Pokemon & { details: PokeApiPokemon }>> {
    const pokemons = await this.getUserPokemons(userId);
    
    const pokemonsWithDetails = await Promise.all(
      pokemons.map(async (pokemon) => {
        const details = await this.pokemonClient.getPokemonById(pokemon.pokemonId);
        return { ...pokemon, details };
      })
    );

    return pokemonsWithDetails;
  }
}

