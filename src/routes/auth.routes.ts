import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/singup', AuthController.singUp);
authRouter.post('/validateCode', AuthController.validateCode);
authRouter.post('/resendValidateCode', AuthController.resendValidateCode);

export default authRouter;
