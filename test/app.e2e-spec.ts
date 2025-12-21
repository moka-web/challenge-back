import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../src/database/database.module';
import { getTestDatabaseConfig } from './test.helper'; // Verifica que la ruta sea correcta

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;


beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule], // Solo importas el AppModule
  })
    /* ESTA ES LA MAGIA: 
      Reemplaza el DatabaseModule real (que busca localhost) 
      por uno que use la config de test (que busca 'postgres')
    */
    .overrideModule(DatabaseModule) 
    .useModule(TypeOrmModule.forRoot(getTestDatabaseConfig()))
    .compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});



  // Muy importante: cerrar la conexión al terminar
afterAll(async () => {
  if (app) { // Solo cierra si la app llegó a inicializarse
    await app.close();
  }
});
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });
});