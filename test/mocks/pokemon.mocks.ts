import { PokemonClient, PokeApiPokemon } from '../../src/clients/pokemon.client';

/**
 * Mock data para los tests de Pokemon
 */
export const mockPikachu: PokeApiPokemon = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: 'https://example.com/pikachu.png' },
  height: 4,
  weight: 60,
};

export const mockCharizard: PokeApiPokemon = {
  id: 6,
  name: 'charizard',
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  sprites: { front_default: 'https://example.com/charizard.png' },
  height: 17,
  weight: 905,
};

/**
 * Crea un mock del PokemonClient
 */
export function createPokemonClientMock(): jest.Mocked<PokemonClient> {
  return {
    getPokemonById: jest.fn(),
    getPokemonByName: jest.fn(),
  } as any;
}

