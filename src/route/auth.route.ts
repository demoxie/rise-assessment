import express from 'express';
import { AuthController } from '../controller/auth.controller';

export class AuthRoute{
  private authController: AuthController;
  registerRoute(app: express.Application){
    this.authController = new AuthController();
    const {
      register,
      login,
      logout
    } = this.authController;
    app.post('/auth/register', register);
    app.post('/auth/login', login);
    app.get('/auth/logout', logout);
  }
}