import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

 // @column pertence a TypeORM es para definir las columnas de la tabla


@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn()

  id: number;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @Column({ type: 'varchar', length: 255 })

  name: string;

  @ApiProperty({ description: 'Email del usuario', example: 'juan@example.com' })
  @Column({ type: 'varchar', length: 255, unique: true })

  email: string;

  @ApiProperty({ description: 'Fecha de creación del usuario', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp' })

  createdAt: Date;

  @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
  @Column({ type: 'varchar', length: 255, select: false })
  //esto no deberia estar en la base de datos pero lo dejo para que se pueda autenticar
  password: string;


  @ApiProperty({
    description: 'Lista de pokemones del usuario (IDs)',
    example: [1, 5, 23],
    type: [Number],
  })

  @Column('int', { array: true, default: [] })
  pokemons: number[];

  // @ApiProperty({ description: 'Color favorito del usuario', example: 'Azul' })
  // @Column({ type: 'varchar', length: 100, nullable: true })
  // favouriteColor: string | null;

}

