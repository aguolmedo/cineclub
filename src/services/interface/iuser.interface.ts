export interface IUserService {
  create_user(data: any): Promise<any>;
  genere_token_password_recovery(email: string): Promise<any>;
  regenerate_password(token: string, newPassword: string): Promise<any>;
}
