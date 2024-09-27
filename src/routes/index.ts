import { Router } from 'express';
import testRouter from './test.routes';
import roleRouter from './role.routes';
import authRouter from './auth.routes';

const mainRouter = Router();

// add some routes
mainRouter.use('/test', testRouter);
mainRouter.use('/role', roleRouter);
mainRouter.use('/auth', authRouter);

export default mainRouter;