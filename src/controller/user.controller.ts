import { NextFunction, Request, Response } from 'express';
import { CommentDTO, CreatePostDTO, JwtPayload } from '../dto/dto';
import { UserService } from '../service/user.service';

export class UserController{
  private userService: UserService;
  constructor( ) {
    this.userService=new UserService();
  }
  createPost = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const dto: CreatePostDTO = req.body;
      const id = parseInt(req.params.id);
      const user: JwtPayload = req["user"];
      const resp = await this.userService.createPost(dto, user, id);
      res.status(resp.statusCode).json(resp);
    } catch (e) {
      next(e);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const resp = await this.userService.getAllUsers();
      res.status(resp.statusCode).json(resp);
    }catch (e) {
      next(e);
    }
  };

  makeComment = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const dto: CommentDTO = req.body;
      const user: JwtPayload = req["user"];
      const postId = parseInt(req.params.postId);
      const resp = await this.userService.makeComment(dto, user, postId);
      res.status(resp.statusCode).json(resp);
    }catch (e) {
      next(e);
    }
  };

  getUserPosts = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const userId = parseInt(req.params.userId);
      const resp = await this.userService.getUserPosts(userId);
      res.status(resp.statusCode).json(resp);
    }catch (e) {
      next(e);
    }
  }

}