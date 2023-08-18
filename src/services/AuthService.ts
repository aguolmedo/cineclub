import { injectable } from "inversify";
import { IAuthService } from "./interface/IAuthService";
import User from "../model/user";

const jwt = require("jsonwebtoken");

// @ts-ignore
@injectable()
export class AuthService implements IAuthService {
  constructor() {}

  public async accesToken(basicAuth: string) {
    try {
      const user: User = new User(
        basicAuth.split(":")[0],
        basicAuth.split(":")[1],
      );
      if (
        user.username != process.env.userADMIN ||
        user.password != process.env.passwordADMIN
      )
        return;

      return jwt.sign({ user }, process.env.SECRET, { expiresIn: "300s" });
    } catch (e) {
      return e;
    }
  }
}
