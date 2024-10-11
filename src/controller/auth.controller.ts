import { NextFunction, Request, Response } from 'express';
import { SignupDTO, LoginDTO, LogoutDTO } from '../dto/dto';

import { AuthService } from '../service/auth.service';

export class AuthController{
  private authService: AuthService;
  constructor( ) {
    this.authService=new AuthService();
  }
  register = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const dto: SignupDTO = req.body;
      const resp = await this.authService.register(dto);
      res.status(resp.statusCode).json(resp);
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const dto: LoginDTO = req.body;
      const resp = await this.authService.login(dto);
      res.status(resp.statusCode).json(resp);
    }catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const token  = req.headers['authorization']?.split(' ')[1];
      const dto: LogoutDTO = {
        token: token
      }
      const resp = await this.authService.logout(dto);
      res.status(resp.statusCode).json(resp);
    }catch (e) {
      next(e);
    }
  };

}