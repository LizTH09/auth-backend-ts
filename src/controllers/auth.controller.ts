import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import AuthActuator from '../actuators/auth.actuator';
import { UserAccountType } from '../models/user.model';

class AuthController {
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if(!email) throw new Error('Email missing');
      
      const user = await AuthActuator.validateUser(email);

      const response = await AuthActuator.sendValidateCode({ mode: 'FORGOT_PASSWORD', userId: user._id.toString() }, req.locals);

      return successResponse({ data:response.success, message: response.message, res, status: response.status });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

  async getRoles(req: Request, res: Response) {
    try {
      const roles = await AuthActuator.getAllRoles();
      const locals = req.locals;

      return successResponse({ data : { locals, roles }, message: 'Roles in DB', res, status: 200 });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, rememberPassword } = req.body;
  
      if(!email || !password) throw new Error('Data missing');
      
      const user = await AuthActuator.validateUser(email);
      
      if(!user) throw new Error('User not exist');
    
      if(user.accountType === UserAccountType.Local) {
        const storedPassword  = user.localAccount?.password;
  
        if(!storedPassword)  throw new Error('PASSWORD NOT FOUND'); 
  
        const validatedPassword = await AuthActuator.validatePassword({ password: password, userId: user._id.toString() });
  
        if(validatedPassword.success) {
          const accessToken = await AuthActuator.generateToken({
            email,
            timeToExpires: '3d',
            userId: user._id.toString()
          });
  
          const refreshTokenExpires = rememberPassword ? '30d' : '7d';
  
          const refreshToken = await AuthActuator.generateToken({
            email,
            timeToExpires: refreshTokenExpires,
            userId: user._id.toString()
          });
          
          res.cookie('refreshToken', refreshToken);
          res.cookie('accessToken', accessToken);
          res.cookie('userId', user._id.toString());
        }
  
        return successResponse({ message: validatedPassword.message, res });
      }

      const response = await AuthActuator.sendValidateCode({ mode: 'LOGIN', userId: user._id.toString() }, req.locals);
  
      res.cookie('userId', user._id.toString());
  
      return successResponse({ message: response.message, res, status: response.status });  
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
  
  async logout(req: Request, res: Response) {
    try {
      Object.keys(req.cookies).forEach(cookie => {
        res.clearCookie(cookie);
      });
  
      return successResponse({ message: 'Successfully logged out', res, status: 200 });
    } catch (error) {
      return errorResponse({
        error,
        message: 'Something went wrong during logout',
        res,
        status: 500
      });
    }
  }
  async requestRecoveryCode(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if(!email) throw new Error('Email is required');

      const user = await AuthActuator.validateUser(email);

      if(!user) throw new Error('User not found');

      const { success } = await AuthActuator.sendValidateCode({ mode: 'RECOVERY_PASSWORD', userId: user._id.toString() }, req.locals);
        
      if(!success) throw new Error('Error sending code');

      return successResponse({ message: 'Code sent to your email', res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

  async recoveryPassword(req: Request, res: Response) {
    try {
      const { code, email, password, mode } = req.body;

      if(!code || !email || !password || !mode) throw new Error('Data is missing');

      const user = await AuthActuator.validateUser(email);

      if(!user) throw new Error('User not found');
      
      if(user.accountType !== 'LOCAL') throw new Error('No se puede actualizar un contraseña de cuenta externa');

      const { success } = await AuthActuator.validateCode({ code, mode, userId: user._id.toString() });
      
      if(!success) throw new Error('CODE INVALID');
      
      const response = await AuthActuator.updatePassword({ newPassword: password, userId: user._id.toString() });
      
      return successResponse({ message: response.message, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

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
      const code = await AuthActuator.sendValidateCode({ mode: 'SINGUP', userId: newUser._id.toString() }, req.locals);
      
      return successResponse({ data: { code, newUser }, message: 'Singup success, and email was send to te email', res });
    } catch (error) {
      return errorResponse({ error: error, message: 'Sing up error', res, status: 500 });
    }
  }

  async validateCode(req: Request, res: Response) {
    try {
      const { code, mode } = req.body;
      const cookieUserId = req.cookies.userId;
      
      if(!code) throw new Error('Code missing'); 

      const verifyCode = await AuthActuator.validateCode({
        code,
        mode,
        userId: cookieUserId
      });

      if(!verifyCode) throw new Error('The code could not be validated');
      
      res.cookie('refreshToken', verifyCode.refreshToken);
      res.cookie('accessToken', verifyCode.accessToken);

      return successResponse({ message: verifyCode.message, res, status: 201 });
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
        await AuthActuator.updateTypeAccount({ type: UserAccountType.External, userId: user._id.toString() });
        const response = await AuthActuator.sendValidateCode({ mode: 'SINGUP', userId: user._id.toString() }, req.locals);

        return successResponse({ message: response.message , res });
      }

      await AuthActuator.updateTypeAccount({ type: UserAccountType.Local, userId: user._id.toString() });

      return successResponse({ message: 'User validated', res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

}

export default new AuthController();