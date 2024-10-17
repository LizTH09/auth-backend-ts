import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { errorResponse } from '../utils';
import { JWT__SECRET_KEY } from '../configs';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';

interface MyTokenPayload extends JwtPayload {
    userId: string;
    email: string;
  }

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies['accessToken'];
    
    if(!accessToken) return errorResponse({ message: 'Access token not found', res, status: 401 }); 
    
    let userData;
    
    try {
      const decoded = jwt.verify(accessToken, JWT__SECRET_KEY) as MyTokenPayload;
          
      userData = { ...decoded, expired: false }; 
    } catch (error) {
      if(error instanceof jwt.TokenExpiredError) 
        return errorResponse({ error, message: 'Token expirado', res, status: 401 });

      return errorResponse({ error, message: 'Invalid token', res, status: 401 });
    }

    if(userData.expired) 
      return errorResponse({ message: 'Token expirado', res, status: 401 });
  
    const user = await UserModel.findById(userData.userId);
    
    if(!user) return errorResponse({ message: 'User not found', res, status: 401 });
  
    const role = await RoleModel.findById(user.roleId);
      
    req.locals = {
      now: new Date(),
      role: role,
      user,
      userId: userData.userId,
    };
    
    return next();
  } catch (error) {
    return errorResponse({ error, message: 'Error en el middleware de autenticación', res, status: 500 });
  }
};