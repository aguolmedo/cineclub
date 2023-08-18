import { injectable } from "inversify";
import { IHealthcheckService } from "./interface/IHealthcheckService";

// @ts-ignore
@injectable()
export class HealthcheckService implements IHealthcheckService {
  constructor() {}

  public async healthCheck() {
    let response = {
      version: process.env.npm_package_version,
    };
    try {
      return response;
    } catch (e) {
      return e;
    }
  }
}
