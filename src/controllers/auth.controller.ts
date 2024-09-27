import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import AuthActuator from '../actuators/auth.actuator';

class AuthController {
  async singUp(req: Request, res: Response) {
    try {
      const { birthDay, country, docNumber, docType, email, firstName, gender, lastName, password, phone } = req.body;
    
      const newUser = await AuthActuator.createNewUser({
        birthDay,
        country,
        docNumber,
        docType,
        email,
        firstName,
        gender,
        lastName,
        password,
        phone
      });

      if(!newUser) return errorResponse({ message: 'Error at create the user', res, status: 400 });
    
      return successResponse({ data: newUser, res });
    } catch (error) {
      return errorResponse({ error: error, res });
    }
  }
}

export default new AuthController();