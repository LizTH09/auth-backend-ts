import type { IContext } from '.';

declare global {
  namespace Express {
    interface Request {
      baseURL: string;
      locals: IContext
    }
  }
}