import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity{
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ type: 'varchar', length: 100 })
  password: string

  @OneToMany(() => Post, post => post.user)
  posts?: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments?: Comment[];
}