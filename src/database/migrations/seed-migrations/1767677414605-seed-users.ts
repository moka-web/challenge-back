import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1767677414605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (name, email, password, pokemons, "createdAt")
      VALUES
        ('Ana García', 'ana.garcia+1@example.com', 'password123', '{}'::int[], now()),
        ('Carlos Ruiz', 'carlos.ruiz+1@example.com', 'password123', '{}'::int[], now()),
        ('María López', 'maria.lopez+1@example.com', 'password123', '{}'::int[], now()),
        ('Pedro Martínez', 'pedro.martinez+1@example.com', 'password123', '{}'::int[], now()),
        ('Lucía Fernández', 'lucia.fernandez+1@example.com', 'password123', '{}'::int[], now()),
        ('Javier Torres', 'javier.torres+1@example.com', 'password123', '{}'::int[], now()),
        ('Sofía Ríos', 'sofia.rios+1@example.com', 'password123', '{}'::int[], now()),
        ('Diego Navarro', 'diego.navarro+1@example.com', 'password123', '{}'::int[], now()),
        ('Valentina Cruz', 'valentina.cruz+1@example.com', 'password123', '{}'::int[], now()),
        ('Lucas Herrera', 'lucas.herrera+1@example.com', 'password123', '{}'::int[], now())
      ;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users
      WHERE email IN (
        'ana.garcia+1@example.com',
        'carlos.ruiz+1@example.com',
        'maria.lopez+1@example.com',
        'pedro.martinez+1@example.com',
        'lucia.fernandez+1@example.com',
        'javier.torres+1@example.com',
        'sofia.rios+1@example.com',
        'diego.navarro+1@example.com',
        'valentina.cruz+1@example.com',
        'lucas.herrera+1@example.com'
      );
    `);
  }
}
