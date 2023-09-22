import Types from '../services/types/types';

import container from '../services/inversify.config';
import { UserService } from '../services/user.service';

let _UserService = container.get<UserService>(Types.UserService);

export async function createUser(request, response) {
  try {
    const respuesta = await _UserService.createUser(request.body);
    if (respuesta) response.status(200).json('User Created');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export const UserController = {
  createUser,
};
