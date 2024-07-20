import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BookEntity } from '../../books/entity/book.entity';

@Entity({ name: 'editorials' })
export class EditorialEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => BookEntity, (book: BookEntity) => book.editorial)
  book: BookEntity[];
}
