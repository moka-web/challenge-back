import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PokeApiPokemon, PokemonClient } from 'src/clients/pokemon.client';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly pokemonClient: PokemonClient,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id: id}
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = this.userRepository.create(userData); // el id tiene que ser autogenerado 
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
 
async addPokemonToUser(userId: number, pokemonId: number): Promise<boolean> {
  // validar pokemonId
  const parsedPokemonId = Number(pokemonId);
  if (!Number.isFinite(parsedPokemonId) || parsedPokemonId <= 0) {
    throw new BadRequestException('pokemonId inválido');
  }

  // traer user y asegurarnos de traer la columna pokemons (por si en la entity la marcaste select: false)
  const user = await this.userRepository.findOne({
    where: { id: userId },
    select: ['id', 'pokemons'], // importante si en la entity pokemons no está por defecto en el select
  });

  if (!user) {
    throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
  }

  // inicializar si viene null/undefined
  if (!Array.isArray(user.pokemons)) {
    user.pokemons = [];
  }

  // push y save
  user.pokemons.push(parsedPokemonId);

  const saved = await this.userRepository.save(user);

  // confirmar que se guardó correctamente
  return Array.isArray(saved.pokemons) && saved.pokemons.includes(parsedPokemonId);
}


  async removePokemonFromUser(userId: number, pokemonId: number): Promise<boolean> {

      // validar pokemonId
      const parsedPokemonId = Number(pokemonId);

      if (!Number.isFinite(parsedPokemonId) || parsedPokemonId <= 0) {
        throw new BadRequestException('pokemonId inválido');
      }

    const user = await this.userRepository.findOne({
      where: {id : userId},
      select :["id","pokemons"]
    })

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    //paso el nuevo array a pokemons
    user.pokemons = user.pokemons.filter(id => id !== pokemonId) 
      

    const saved = await this.userRepository.save(user);
    
    return  !!saved

  }

  async getUserPokemons(userId: number): Promise<Number[]> {

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'pokemons'], // importante si en la entity pokemons no está por defecto en el select
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }


    return user.pokemons

  } 

  async hasPokemon(userId: number, pokemonId: number): Promise<boolean> {

   // traer user y asegurarnos de traer la columna pokemons (por si en la entity la marcaste select: false)
   const user = await this.userRepository.findOne({
    where: { id: userId },
    select: ['id', 'pokemons'], // importante si en la entity pokemons no está por defecto en el select
  });

    return !!user?.pokemons.includes(pokemonId)
  }




  async getUserPokemonsWhitDetails(userId : number):Promise<PokeApiPokemon[]>{

      const pokemonsIds = await this.getUserPokemons(userId)
      
      //el promise all sirve para ...
      const getUserPokemonsWithDetails = await Promise.all(
        pokemonsIds.map(pokemonID =>this.pokemonClient.getPokemonById(pokemonID)))
     
    
      return getUserPokemonsWithDetails ; 
  }


}



