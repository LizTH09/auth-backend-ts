import { Router } from 'express';
import  rolController from '../controllers/rol.controller';

const rolRouter: Router = Router();

rolRouter.post('/createDefault', rolController.initializeRolesAndPermissions);

export default rolRouter;