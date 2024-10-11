import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();
const {REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASS} = process.env;
const isNotLocalHost = REDIS_HOST === 'localhost' && REDIS_PASS === '';

const redisUrl = isNotLocalHost ?
  `redis://${REDIS_HOST}:${REDIS_PORT}` : `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`;

export const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => console.log('Redis Client Error', err));





export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value);
};

export const getValue = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

export const deleteValue = async (key: string): Promise<void> => {
  await redisClient.del(key);
};