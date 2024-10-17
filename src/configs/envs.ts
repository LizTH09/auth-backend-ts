import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV as string ?? 'development';
export const SERVER_PORT = process.env.SERVER_PORT as string;
export const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI as string;
export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS as string;
export const JWT__SECRET_KEY = process.env.JWT__SECRET_KEY as string;
export const API_KEY_MAIL_SERVER = process.env.API_KEY_MAIL_SERVER as string;