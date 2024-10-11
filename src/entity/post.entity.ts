import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Post extends BaseEntity{
  @Column()
  title: string

  @Column()
  content: string

  @ManyToOne(() => User, user => user.posts)
  user?: User;

  @OneToMany(() => Comment, comment => comment.post, { cascade: true })
  comments?: Comment[];
}