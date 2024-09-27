import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/singup', AuthController.singUp);

export default authRouter;
