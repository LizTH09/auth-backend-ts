import { Router } from 'express';
import  roleController from '../controllers/role.controller';

const roleRouter: Router = Router();

roleRouter.post('/createDefault', roleController.initializeRolesAndPermissions);

export default roleRouter;