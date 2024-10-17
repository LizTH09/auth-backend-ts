import { Request } from 'express';
import { DataSource } from './DataSource';
import { API_KEY_MAIL_SERVER } from '../configs/envs';

export class MailServerAPI extends DataSource {
  constructor(req: Request) {
    const { baseURL } = req;
    const authorization = req.cookies['accessToken']; 
    
    super(baseURL);
      
    if(authorization) 
      this.instance.defaults.headers['Authorization'] = authorization;
      
    this.instance.defaults.headers.common['apiKey'] = API_KEY_MAIL_SERVER;
  }
  
  async sendMails(params: unknown): Promise<unknown> {
    const url = 'http://localhost:4320/api/v1/mailing/sendMails'; 

    const response = await this.post(url, params);
    
    return response;
  }
}

