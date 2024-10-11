import 'express-async-errors';
import express from 'express';
import "reflect-metadata";
import morgan from 'morgan';

import { AuthRoute } from './route/auth.route';
import { errorHandler } from './middleware/validate.middleware';
import { UserRoute } from './route/user.route';
const app = express();
app.use(express.json());
app.use(morgan("dev"));
const authRouter = new AuthRoute();
const userRoute = new UserRoute();
authRouter.registerRoute(app);
userRoute.registerRoute(app);
app.use(errorHandler);
export default app;