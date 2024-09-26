import { Request, Response } from 'express';
import roleActuator from '../actuators/role.actuator';
import { errorResponse, successResponse } from '../utils';

class RoleController {
  async initializeRolesAndPermissions(_: Request, res: Response) {
    try {
      const defaultValues = await roleActuator.createRolesAndPermissionsDefault();
        
      return successResponse({ data: defaultValues, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

export default new RoleController();