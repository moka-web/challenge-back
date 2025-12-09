import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


//esto es una interfaz para el pokemon de la PokeAPI
// se utiliza para no mockear mi base de datos, sino la api de la PokeAPI
// y testear la aplicacion

// - db testing
// - Mockear dependencias externas


// quiero agregar integration testing con Jest para los user endpoints. quiero usar una base de datos sql real pero debe ser  una base de datos de testing y quiero mockear la respuesta de la api de pokemon api para que el test sea isolado. 



export interface PokeApiPokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
}

@Injectable()
export class PokemonClient {
  private readonly baseUrl = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';  

  constructor(private readonly httpService: HttpService) {}

  async getPokemonById(id: number): Promise<PokeApiPokemon> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<PokeApiPokemon>(`${this.baseUrl}/pokemon/${id}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Pokemon con ID ${id} no encontrado en la PokeAPI`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        'Error al consultar la PokeAPI',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async getPokemonByName(name: string): Promise<PokeApiPokemon> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<PokeApiPokemon>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Pokemon "${name}" no encontrado en la PokeAPI`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        'Error al consultar la PokeAPI',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
