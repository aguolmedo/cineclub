import { AuthService } from '../services/auth.service';
import Types from '../services/types/types';
import container from '../services/inversify.config';
import base64Helper from '../utils/base64.helper';

let _AuthService = container.get<AuthService>(Types.AuthService);

export async function accessToken(request, response) {
  if (!request.headers.authorization) {
    return response.status(401).json('auth error \n debes mandar un basicAuth');
  }

  const basicAuth = base64Helper.decode(
    request.headers.authorization.split(' ')[1],
  );

  let token = await _AuthService.acces_token(basicAuth);

  if (!token) {
    response.status(403).json('not token today');
  }
  response.status(200).json(token);
}

export async function verifyToken(request, response) {
  if (!request.headers.authorization) {
    return response.status(401).json('auth error debes mandar un token');
  }

  let token = await _AuthService.verify_token(request.headers.authorization);

  if (!token) {
    response.status(403).json('not token today');
  }
  response.status(200).json(token);
}

export const AuthController = {
  accessToken,
  verifyToken,
};
