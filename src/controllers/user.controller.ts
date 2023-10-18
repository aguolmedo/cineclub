import Types from '../services/types/types';
import emailHelper from '../utils/email.helper';
import container from '../services/inversify.config';
import { UserService } from '../services/user.service';

let _UserService = container.get<UserService>(Types.UserService);

export async function createUser(request, response) {
  try {
    const respuesta = await _UserService.create_user(request.body);
    if (respuesta) response.status(200).json('User Created');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function genereteTokenRecoverPassword(request, response) {
  try {
    const token = await _UserService.genere_token_password_recovery(
      request.body.email,
    );

    if (!token) response.status(404).json('user not found');

    await emailHelper.send_mail(
      'Forgot Password <cineclubplay@gmail.com>',
      request.body.email,
      'PASSWORD RECOVERY CINECLUBPLAY',
      'No reply',
      `<p>https://cineclub-frontend-angular.fly.dev/us/recoverypassword?token=${token}</p>`,
    );

    response.status(200).json('Password recovery token generated');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function recoverPassword(request, response) {
  try {
    const token = request.query.token;

    if (!token) response.status(400).json('no token');

    if (!request.body.password) response.status(400).json('no password');

    const passwordRecovered = await _UserService.regenerate_password(
      token,
      request.body.password,
    );
    if (passwordRecovered)
      return response.status(200).json('Password regenerated succesfully');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export const UserController = {
  createUser,
  genereteTokenRecoverPassword,
  recoverPassword,
};
