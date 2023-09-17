export interface IAuthService {
  accesToken(basicAuth: string): Promise<any>;
  verifyToken(token: string): Promise<any>;
}
