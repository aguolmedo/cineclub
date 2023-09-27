export interface IAuthService {
  acces_token(basicAuth: string): Promise<any>;
  verify_token(token: string): Promise<any>;
}
