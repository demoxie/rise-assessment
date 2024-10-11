import express, { Router } from 'express';
import { validateToken } from '../middleware/validate.middleware';
import { UserController } from '../controller/user.controller';

export class UserRoute {
  private userController: UserController;
  registerRoute(app: express.Application){
    this.userController = new UserController();
    const {
      createPost,
      getAllUsers,
      makeComment,
      getUserPosts
    } = this.userController;
    app.post('/users/:id/posts',validateToken, createPost);
    app.get('/users',validateToken,getAllUsers);
    app.post('/posts/:postId/comments',validateToken, makeComment);
    app.get('/users/:userId/posts',validateToken, getUserPosts);
  }
}