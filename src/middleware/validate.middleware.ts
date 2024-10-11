import express, { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { JwtPayload } from '../dto/dto';
import { APIException } from '../exceptions/exception';
dotenv.config();

export const generateToken = (user: JwtPayload) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export const validateToken = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
  }

  try {
    req["user"] = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token: '+error.message });
  }
}


export const isValidToken = (token: string): boolean => {
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch (error) {
    console.error("Error occurred ", error);
    return false;
  }
};

export const errorHandler = (err: any, req: express.Request, res: express.Response, next: NextFunction) => {
  console.error("Resolving errors ",typeof err);
  if (err instanceof APIException) {

    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
