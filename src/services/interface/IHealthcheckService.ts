export interface IHealthcheckService {
  healthCheck(): Promise<any>;
}
