import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class DataSource {
  instance: AxiosInstance;
    
  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
  }

  async get<T>(baseURL: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(baseURL, config);
  }
    
  async post<T, D>(baseURL: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(baseURL, data, config);
  }
    
  async put<T, D>(baseURL: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(baseURL, data, config);
  }
    
  async patch<T, D>(baseURL: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(baseURL, data, config);
  }
    
  async delete<T>(baseURL: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(baseURL, config);
  }  
}

