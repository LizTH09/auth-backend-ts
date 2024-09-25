import { Router } from 'express';
import testRouter from './test.routes';
import rolRouter from './rol.routes';

const mainRouter = Router();

// add some routes
mainRouter.use('/test', testRouter);
mainRouter.use('/rol', rolRouter);

export default mainRouter;