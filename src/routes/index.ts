import { Router } from 'express';
import testRouter from './test.routes';
import roleRouter from './role.routes';

const mainRouter = Router();

// add some routes
mainRouter.use('/test', testRouter);
mainRouter.use('/role', roleRouter);

export default mainRouter;