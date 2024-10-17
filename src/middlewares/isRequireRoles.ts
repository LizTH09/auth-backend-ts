import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils';

export const isRequireRoles = (roles: string[]) => async (req: Request, res:Response, next: NextFunction) => {
  try {
    if(!roles.includes(req.locals?.role)) return errorResponse({ message: 'This role does not have the necessary permissions', res, status: 401 });
    
  } catch (error) {
    return errorResponse({ error, res });
  }
    
  next();
};