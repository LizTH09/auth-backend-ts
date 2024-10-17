import { NextFunction, Request, Response } from 'express';
import getDataSources from './getDataSource';

export const getGlobalContext = async (req: Request) => {
  const now = new Date();
  const authorization = req.cookies.accessToken;
  const dataSources = getDataSources(req);
  
  return {
    Authorization: authorization,
    DateNow: now.toString(),
    ...dataSources
  };
};

export const setGlobalContext = async (req: Request, _: Response, next: NextFunction) => {
  const data = await getGlobalContext(req);
  const dataSources = getDataSources(req);
  req.locals = {
    ...req.locals,
    ...data, 
    ...dataSources
  };
  next();
};
