export interface IAuthService {
  accesToken(basicAuth: string): Promise<any>;
}
