import 'reflect-metadata';
import app from './src/app';
import AppDataSource from './src/config/data-source';
import { redisClient } from './src/config/redis.config';
import * as dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

AppDataSource.initialize().then(() => {
  app.listen(process.env.PORT, async () => {
    console.log('TypeORM connection has been established successfully.');
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    await redisClient.connect();
    console.log('Redis client connected successfully');
  });
}).catch((error) => console.error('Error connecting to the database:', error));

