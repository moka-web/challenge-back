import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { PokemonClient } from '../src/clients/pokemon.client';
import { User } from '../src/users/entities/user.entity';
import { Pokemon } from '../src/users/entities/pokemon.entity';
import {
  createTestModule,
  initializeTestApp,
  cleanDatabase,
  closeTestApp,
} from './test.helper';
import {
  createPokemonClientMock,
  mockPikachu,
  mockCharizard,
} from './mocks/pokemon.mocks';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>; // Aplicación NestJS para testing
  let dataSource: DataSource; // Conexión a la base de datos para testing
  let pokemonClientMock: jest.Mocked<PokemonClient>; // Mock del cliente de la PokeAPI

  beforeAll(async () => {
    // Crear mock del PokemonClient
    pokemonClientMock = createPokemonClientMock();

    // Crear módulo de testing con configuración especial
    const moduleFixture = await createTestModule(pokemonClientMock);

    // Inicializar aplicación y obtener dataSource
    const { app: testApp, dataSource: testDataSource } =
      await initializeTestApp(moduleFixture);
    app = testApp;
    dataSource = testDataSource;
    
  });

  afterAll(async () => {
    // Limpiar la base de datos después de todos los tests
    await closeTestApp(app, dataSource);
  });

  beforeEach(async () => {
    // Limpiar tablas antes de cada test
    await cleanDatabase(dataSource);
    // Resetear mocks
    jest.clearAllMocks();
  });

  describe('/users (GET)', () => {
    it('debería retornar una lista vacía cuando no hay usuarios', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([]);
    });

    it('debería retornar todos los usuarios', async () => {
      // Crear usuarios directamente en la BD
      const userRepo = dataSource.getRepository(User);
      const user1 = await userRepo.save({
        name: 'Juan Pérez',
        email: 'juan@test.com',
        password: 'password123',
      });
      const user2 = await userRepo.save({
        name: 'María García',
        email: 'maria@test.com',
        password: 'password456',
      });

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].email).toBe(user1.email);
      expect(response.body[1].email).toBe(user2.email);
    });
  });

  describe('/users/:id (GET)', () => {
    it('debería retornar un usuario por ID', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@test.com');
    });

    it('debería retornar 404 cuando el usuario no existe', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(404);
    });
  });

  describe('/users (POST)', () => {
    it('debería crear un nuevo usuario', async () => {
      const newUser = {
        name: 'Nuevo Usuario',
        email: 'nuevo@test.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('debería retornar 409 cuando el email ya existe', async () => {
      const userRepo = dataSource.getRepository(User);
      await userRepo.save({
        name: 'Usuario Existente',
        email: 'existente@test.com',
        password: 'password123',
      });

      const newUser = {
        name: 'Otro Usuario',
        email: 'existente@test.com',
        password: 'password456',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(409);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('debería actualizar un usuario existente', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Usuario Original',
        email: 'original@test.com',
        password: 'password123',
      });

      const updateData = {
        name: 'Usuario Actualizado',
        email: 'actualizado@test.com',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
    });

    it('debería retornar 404 cuando el usuario no existe', () => {
      return request(app.getHttpServer())
        .put('/users/999')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('debería eliminar un usuario', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Usuario a Eliminar',
        email: 'eliminar@test.com',
        password: 'password123',
      });

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);

      // Verificar que fue eliminado
      await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(404);
    });

    it('debería retornar 404 cuando el usuario no existe', () => {
      return request(app.getHttpServer())
        .delete('/users/999')
        .expect(404);
    });
  });

  describe('/users/:id/pokemons (POST)', () => {
    it('debería agregar un pokemon a un usuario por ID', async () => {
      // Setup: crear usuario
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer@test.com',
        password: 'password123',
      });

      // Mock de la respuesta de PokeAPI
      pokemonClientMock.getPokemonById.mockResolvedValue(mockPikachu);

      const response = await request(app.getHttpServer())
        .post(`/users/${user.id}/pokemons`)
        .send({ pokemonId: 25 })
        .expect(201);

      expect(response.body.pokemon.pokemonId).toBe(25);
      expect(response.body.pokemon.name).toBe('pikachu');
      expect(response.body.pokeApiData).toEqual(mockPikachu);
      expect(pokemonClientMock.getPokemonById).toHaveBeenCalledWith(25);
    });

    it('debería agregar un pokemon a un usuario por nombre', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer2@test.com',
        password: 'password123',
      });

      pokemonClientMock.getPokemonByName.mockResolvedValue(mockCharizard);

      const response = await request(app.getHttpServer())
        .post(`/users/${user.id}/pokemons`)
        .send({ pokemonName: 'charizard' })
        .expect(201);

      expect(response.body.pokemon.pokemonId).toBe(6);
      expect(response.body.pokemon.name).toBe('charizard');
      expect(pokemonClientMock.getPokemonByName).toHaveBeenCalledWith('charizard');
    });

    it('debería retornar 404 cuando el usuario no existe', async () => {
      pokemonClientMock.getPokemonById.mockResolvedValue(mockPikachu);

      await request(app.getHttpServer())
        .post('/users/999/pokemons')
        .send({ pokemonId: 25 })
        .expect(404);
    });

    it('debería retornar 409 cuando el usuario ya tiene el pokemon', async () => {
      const userRepo = dataSource.getRepository(User);
      const pokemonRepo = dataSource.getRepository(Pokemon);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer3@test.com',
        password: 'password123',
      });

      // Agregar pokemon directamente
      await pokemonRepo.save({
        userId: user.id,
        pokemonId: 25,
        name: 'pikachu',
      });

      pokemonClientMock.getPokemonById.mockResolvedValue(mockPikachu);

      await request(app.getHttpServer())
        .post(`/users/${user.id}/pokemons`)
        .send({ pokemonId: 25 })
        .expect(409);
    });
  });

  describe('/users/:id/pokemons (GET)', () => {
    it('debería retornar los pokemones de un usuario', async () => {
      const userRepo = dataSource.getRepository(User);
      const pokemonRepo = dataSource.getRepository(Pokemon);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer4@test.com',
        password: 'password123',
      });

      await pokemonRepo.save([
        { userId: user.id, pokemonId: 25, name: 'pikachu' },
        { userId: user.id, pokemonId: 6, name: 'charizard' },
      ]);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/pokemons`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].pokemonId).toBe(25);
      expect(response.body[1].pokemonId).toBe(6);
    });

    it('debería retornar 404 cuando el usuario no existe', () => {
      return request(app.getHttpServer())
        .get('/users/999/pokemons')
        .expect(404);
    });
  });

  describe('/users/:id/pokemons/details (GET)', () => {
    it('debería retornar pokemones con detalles de la PokeAPI', async () => {
      const userRepo = dataSource.getRepository(User);
      const pokemonRepo = dataSource.getRepository(Pokemon);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer5@test.com',
        password: 'password123',
      });

      await pokemonRepo.save([
        { userId: user.id, pokemonId: 25, name: 'pikachu' },
        { userId: user.id, pokemonId: 6, name: 'charizard' },
      ]);

      // Mock de las respuestas de PokeAPI
      pokemonClientMock.getPokemonById
        .mockResolvedValueOnce(mockPikachu)
        .mockResolvedValueOnce(mockCharizard);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/pokemons/details`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].details).toEqual(mockPikachu);
      expect(response.body[1].details).toEqual(mockCharizard);
      expect(pokemonClientMock.getPokemonById).toHaveBeenCalledTimes(2);
    });
  });

  describe('/users/:id/pokemons/:pokemonId (DELETE)', () => {
    it('debería eliminar un pokemon de un usuario', async () => {
      const userRepo = dataSource.getRepository(User);
      const pokemonRepo = dataSource.getRepository(Pokemon);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer6@test.com',
        password: 'password123',
      });

      await pokemonRepo.save({
        userId: user.id,
        pokemonId: 25,
        name: 'pikachu',
      });

      await request(app.getHttpServer())
        .delete(`/users/${user.id}/pokemons/25`)
        .expect(200);

      // Verificar que fue eliminado
      const pokemons = await pokemonRepo.find({
        where: { userId: user.id, pokemonId: 25 },
      });
      expect(pokemons).toHaveLength(0);
    });

    it('debería retornar 404 cuando el pokemon no existe', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo.save({
        name: 'Pokemon Trainer',
        email: 'trainer7@test.com',
        password: 'password123',
      });

      await request(app.getHttpServer())
        .delete(`/users/${user.id}/pokemons/999`)
        .expect(404);
    });
  });
});

