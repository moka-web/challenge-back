import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { App } from 'supertest/types';
import { UsersModule } from '../src/users/users.module';
import { PokemonClient } from '../src/clients/pokemon.client';
import { User } from '../src/users/entities/user.entity';
import { Pokemon } from '../src/users/entities/pokemon.entity';

/**
 * Configuración de la base de datos para testing
 */
export function getTestDatabaseConfig() {
  return {
    type: 'postgres' as const,
    host: process.env.DB_TEST_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT || '5433', 10),
    username: process.env.DB_TEST_USERNAME || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'postgres',
    database: process.env.DB_TEST_DATABASE || 'users_db_test',
 
    entities: [User, Pokemon],
    synchronize: true, // Solo para testing - recrea el schema
    dropSchema: true, // Limpia la BD antes de cada test suite
  };
}

/**
 * Crea un módulo de testing con la configuración necesaria
 */
export async function createTestModule(
  pokemonClientMock: jest.Mocked<PokemonClient>,
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(getTestDatabaseConfig()),
      UsersModule,
      HttpModule,
    ],
  })
    .overrideProvider(PokemonClient)
    .useValue(pokemonClientMock)
    .compile();
}

/**
 * Inicializa la aplicación de testing
 */
export async function initializeTestApp(
  moduleFixture: TestingModule,
): Promise<{
  app: INestApplication<App>;
  dataSource: DataSource;
}> {
  const app = moduleFixture.createNestApplication();
  const dataSource = moduleFixture.get<DataSource>(DataSource);
  await app.init();

  return { app, dataSource };
}

/**
 * Limpia todas las tablas de la base de datos
 */
export async function cleanDatabase(dataSource: DataSource): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.query('TRUNCATE TABLE pokemons CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
  }
}

/**
 * Cierra la aplicación y la conexión a la base de datos
 */
export async function closeTestApp(
  app: INestApplication<App>,
  dataSource: DataSource,
): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
  await app.close();
}

