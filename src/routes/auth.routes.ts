import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { isAuth } from '../middlewares/isAuth';

const authRouter: Router = Router();

authRouter.get('/', isAuth, AuthController.getRoles);
authRouter.post('/forgotPassword', AuthController.forgotPassword);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/requestRecoveryCode', AuthController.requestRecoveryCode);
authRouter.put('/recoveryPassword', AuthController.recoveryPassword);
authRouter.post('/singup', AuthController.singUp);
authRouter.post('/validateCode', AuthController.validateCode);
authRouter.post('/validateUser', AuthController.validateUser);

export default authRouter;
