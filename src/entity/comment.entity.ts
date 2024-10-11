import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Comment extends BaseEntity{
  @Column()
  content: string

  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' }) // Cascade deletion of comments when a post is deleted
  post: Post;
  @ManyToOne(() => User, user => user.comments)
  author: User;
}