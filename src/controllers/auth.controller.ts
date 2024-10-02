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

      res.cookie('userId', newUser?._id.toString());

      if(!newUser) return errorResponse({ message: 'Error at create the user', res, status: 400 });
      const codeToSend = await AuthActuator.generateRandomCode();
      const code = await AuthActuator.sendValidateCode({ code: codeToSend, mode: 'SINGUP', userId: newUser._id.toString() });
      
      return successResponse({ data: { code, newUser }, message: 'Singup success, and email was send to te email', res });
    } catch (error) {
      return errorResponse({ error: error, message: 'Sing up error', res, status: 500 });
    }
  }

  async validateCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const cookieUserId = req.cookies.userId;

      const verifyCode = await AuthActuator.validateCodeStatus({
        code,
        mode: 'SINGUP',
        userId: cookieUserId
      });

      if(!verifyCode) return errorResponse({ message: 'The code could not be validated', res });
      
      return successResponse({ data: verifyCode, message: verifyCode.message, res, status: 201 });
    } catch (error) {
      return errorResponse({ error: error, res });
    }
  }

  
  async resendValidateCode(req: Request, res: Response) {
    try {
      const userId = req.cookies.userId;
      const codeToSend = await AuthActuator.generateRandomCode();
      const code = await AuthActuator.sendValidateCode({ code: codeToSend, mode: 'SINGUP', userId });

      return successResponse({ data: { code }, message: 'Singup success, and email was send to te email', res });
    } catch (error) {
      return errorResponse({ error: error, res });
    }
  }
}

export default new AuthController();