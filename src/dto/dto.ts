import { OneToMany } from 'typeorm';
import { Post } from '../entity/post.entity';
import { Comment } from '../entity/comment.entity';

export class JwtPayload{
  userId: number;
  email: string;
}

export class APIResponse<D>{
  statusCode: number;
  message: string;
  data?: D;
}

export class SignupResponseDto{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  posts?: Post[];
  comments?: Comment[];
}

export class LoginResponseDto{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
  comments?: Comment[];
}

export class SignupDTO{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export class UserDetails{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
export class LoginDTO{
  email: string;
  password: string;
}

export class LogoutDTO{
  token: string;
}

export class CommentDTO{
  content: string;
}

export class CreatePostDTO{
  title: string;
  content: string;
  comment?: CommentDTO;
}

export class CommentResponseDTO{
  id: number;
  content: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PostResponseDTO{
  id: number;
  title: string;
  content: string;
  comments?: CommentResponseDTO[];
  author: UserDetails;
  createdAt: Date;
  updatedAt: Date;
}