import { Request } from 'express';
import { MailServerAPI } from '../dataSources/MailServerAPI';

const getDataSources = (req: Request) => ({
  mailServerApi : new MailServerAPI(req)
});

export default getDataSources;
  
