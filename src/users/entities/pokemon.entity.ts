import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, RelationId } from 'typeorm';
import { User } from './user.entity';

@Entity('pokemons')
export class Pokemon {
  @ApiProperty({ description: 'ID único del pokemon en la BD', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del pokemon en la PokeAPI', example: 25 })
  @Column({ type: 'int' })
  pokemonId: number;

  @ApiProperty({ description: 'Nombre del pokemon', example: 'pikachu' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.pokemons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'ID del usuario propietario', example: 1 })
  @RelationId((pokemon: Pokemon) => pokemon.user)
  userId: number;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

