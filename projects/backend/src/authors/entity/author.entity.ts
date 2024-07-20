import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { BookEntity } from '../../books/entity/book.entity';

@Entity({ name: 'authors' })
export class AuthorEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  lastname: string;

  @Column({ type: 'int', width: 12, nullable: true })
  @IsInt()
  number_books_published: number;

  @OneToMany(() => BookEntity, (book: BookEntity) => book.author)
  book: BookEntity[];
}
