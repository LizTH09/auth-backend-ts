import { Request, Response } from 'express';
import rolActuator from '../actuators/rol.actuator';
import { errorResponse, successResponse } from '../utils';

class RolController {
  async initializeRolesAndPermissions(_: Request, res: Response) {
    try {
      const defaultValues = await rolActuator.createRolesAndPermissionsDefault();
        
      return successResponse({ data: defaultValues, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

export default new RolController();