import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { AuthorEntity } from '../../authors/entity/author.entity';
import { EditorialEntity } from '../../editorials/entity/editorial.entity';

@Entity({ name: 'books' })
export class BookEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  title: string;

  @Column({ type: 'int', width: 4 })
  @IsInt()
  year: number;

  @Column({ type: 'bigint', width: 13, unique: true })
  @IsInt()
  isbn: number;

  @ManyToOne(() => AuthorEntity, (author: AuthorEntity) => author.book)
  @JoinColumn()
  author: AuthorEntity;

  @ManyToOne(() => EditorialEntity, (author: EditorialEntity) => author.book)
  @JoinColumn()
  editorial: EditorialEntity;
}
