import { Request } from 'express';
import { DataSource } from './DataSource';
import { API_KEY_MAIL_SERVER, API_URL_MAILING } from '../configs/envs';

export class MailServerAPI extends DataSource {
  constructor(req: Request) {
    const baseURL = API_URL_MAILING;
    const authorization = req.cookies['accessToken']; 
    
    super(baseURL);
      
    if(authorization) 
      this.instance.defaults.headers['Authorization'] = authorization;
      
    this.instance.defaults.headers.common['apiKey'] = API_KEY_MAIL_SERVER;
  }
  
  async sendMails(params: unknown): Promise<unknown> {
    const url = '/api/v1/mailing/sendMails'; 

    const response = await this.post(url, params);
    
    return response;
  }
}

