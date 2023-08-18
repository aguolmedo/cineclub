import { AuthService } from "../services/AuthService";
import Types from "../services/types/types";
import container from "../services/inversify.config";
import base64Helper from "../utils/base64Helper";

let _AuthService = container.get<AuthService>(Types.AuthService);

export async function accessToken(request, response) {
  if (!request.headers.authorization) {
    response.status(401).json("auth error \n debes mandar un basicAuth");
    return;
  }

  const basicAuth = base64Helper.decode(
    request.headers.authorization.split(" ")[1],
  );
  let token = await _AuthService.accesToken(basicAuth);

  if (!token) {
    response.status(404).json("not token today");
  }
  response.status(200).json(token);
}

export const AuthController = {
  accessToken,
};
