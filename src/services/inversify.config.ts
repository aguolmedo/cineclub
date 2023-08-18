import { Container } from "inversify";
import Types from "./types/types";
import { IAuthService } from "./interface/IAuthService";
import { AuthService } from "./AuthService";
import { IHealthcheckService } from "./interface/IHealthcheckService";
import { HealthcheckService } from "./HealthcheckService";

const container = new Container();

container.bind<IAuthService>(Types.AuthService).to(AuthService);
container
  .bind<IHealthcheckService>(Types.HealthcheckService)
  .to(HealthcheckService);

export default container;
