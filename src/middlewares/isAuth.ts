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

interface TokenResultSuccess extends MyTokenPayload{
  expired: false;
}

interface TokenResultError {
  expired?: boolean;
  error?: boolean;
}

type TokenResult = TokenResultSuccess | TokenResultError;

const verifyToken = (accessToken: string): TokenResult => {
  try {
    const decoded = jwt.verify(accessToken, JWT__SECRET_KEY) as MyTokenPayload;

    return { ...decoded, expired: false } ; 
  } catch (error) {
    if(error instanceof jwt.TokenExpiredError) 
      return { expired: true } ; 
    
    return { error: true } ; 
  }
};

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies['accessToken'];
    
    if(!accessToken) return errorResponse({ message: 'Access token not found', res, status: 401 }); 
    
    const userData = verifyToken(accessToken);

    if(userData.error || userData.expired) 
      return errorResponse({ message: 'Error de token', res, status: 401 });
  
    const userId = (userData as TokenResultSuccess).userId;

    const user = await UserModel.findById(userId);
    
    if(!user) return errorResponse({ message: 'User not found', res, status: 401 });
  
    const role = await RoleModel.findById(user.roleId);
      
    req.locals = {
      now: new Date(),
      role: role,
      user,
      userId: userId,
    };
    
    return next();
  } catch (error) {
    return errorResponse({ error, message: 'Error en el middleware de autenticación', res, status: 500 });
  }
};