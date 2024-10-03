import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import AuthActuator from '../actuators/auth.actuator';

class AuthController {
  async singUp(req: Request, res: Response) {
    try {
      const { birthDay, country, docNumber, docType, email, firstName, gender, lastName, password, phone } = req.body;
      if(!email || !firstName || !lastName || !password) throw new Error('Error at create the user');

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

      if(!newUser) throw new Error('Error at create the user');
      const code = await AuthActuator.sendValidateCode({ mode: 'SINGUP', userId: newUser._id.toString() });
      
      return successResponse({ data: { code, newUser }, message: 'Singup success, and email was send to te email', res });
    } catch (error) {
      return errorResponse({ error: error, message: 'Sing up error', res, status: 500 });
    }
  }

  async validateCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const cookieUserId = req.cookies.userId;

      if(!code) throw new Error('Code missing'); 

      const verifyCode = await AuthActuator.validateCodeStatus({
        code,
        mode: 'SINGUP',
        userId: cookieUserId
      });

      if(!verifyCode) throw new Error('The code could not be validated');
      
      return successResponse({ data: verifyCode, message: verifyCode.message, res, status: 201 });
    } catch (error) {
      return errorResponse({ error: error, res });
    }
  }

  
  async resendValidateCode(req: Request, res: Response) {
    try {
      const userId = req.cookies.userId;
      const code = await AuthActuator.sendValidateCode({ mode: 'SINGUP', userId });

      return successResponse({ data: { code }, message: 'Singup success, and email was send to te email', res });
    } catch (error) {
      return errorResponse({ error: error, res });
    }
  }

  async validateUser(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if(!email)  throw new Error('Email is required');

      const user = await AuthActuator.validateUser(email);

      if(!user) throw new Error('The user could not be validated');

      if(!user.localAccount?.password) {
        const userUpdated = await AuthActuator.updateTypeAccount({ type: 'EXTERNAL', userId: user._id.toString() });
        const code = await AuthActuator.sendValidateCode({ mode: 'SINGUP', userId: user._id.toString() });

        return successResponse({ data: { code }, message: `Code send, type es account: ${userUpdated?.accountType}`, res });
      }
      
      const userUpdated = await AuthActuator.updateTypeAccount({ type: 'LOCAL', userId: user._id.toString() });

      return successResponse({ data: { userUpdated }, message: `Code send, type es account: ${userUpdated?.accountType}`, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

export default new AuthController();