import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })

  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: User, description: 'Datos del usuario a crear' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: User })
  @ApiResponse({ status: 409, description: 'El email ya está en uso' })

  async create(@Body() userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: User, description: 'Datos del usuario a actualizar' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El email ya está en uso' })

  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() userData: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }

  // Endpoints para pokemones
  @Post(':id/pokemons')
  @ApiOperation({ summary: 'Agregar un pokemon a un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        pokemonId: { type: 'number', description: 'ID del pokemon en la PokeAPI (ej: 25)' },
      },
      oneOf: [
        { required: ['pokemonId'] },
      ]
    }
  })
  @ApiResponse({ status: 201, description: 'Pokemon agregado exitosamente' })
  @ApiResponse({status:400,description:'el servidor no pudo entender o procesar una solicitud'})
  @ApiResponse({ status: 404, description: 'Usuario o Pokemon no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene este pokemon' })

  async addPokemon(

    @Param('id', ParseIntPipe) userId: number,
    @Body() body: { pokemonId: number; }
  ) {
    const pokemonId = body?.pokemonId;
   
    if (!pokemonId) {
      throw new Error('Debe proporcionar pokemonId o pokemonName');
    }

    return this.usersService.addPokemonToUser(userId, pokemonId);
  }

  @Get(':id/pokemons')
  @ApiOperation({ summary: 'Obtener todos los pokemones de un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de pokemones del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserPokemons(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserPokemons(userId);
  }

  @Get(':id/pokemons/details')
  @ApiOperation({ summary: 'Obtener pokemones de un usuario con detalles de la PokeAPI' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de pokemones con detalles completos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  async getUserPokemonsWithDetails(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserPokemonsWithDetails(userId);
  }   // aca hay que resolver el asunto 

  @Delete(':id/pokemons/:pokemonId')
  @ApiOperation({ summary: 'Eliminar un pokemon de un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiParam({ name: 'pokemonId', type: Number, description: 'ID del pokemon en la PokeAPI' })
  @ApiResponse({ status: 200, description: 'Pokemon eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario o Pokemon no encontrado' })

  
  async removePokemon(
    @Param('id', ParseIntPipe) userId: number,
    @Param('pokemonId', ParseIntPipe) pokemonId: number
  ) {
    return this.usersService.removePokemonFromUser(userId, pokemonId);
  }
}

