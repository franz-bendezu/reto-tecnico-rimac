import { AppointmentCountryEnvConfig } from "./appointment-country-env.config";
import { IDatabaseConfig } from "./appointment-country.config.interface";

export class AppointmentPEConfigEnv extends AppointmentCountryEnvConfig {
  get rdsDatabase(): IDatabaseConfig {
    return {
      get proxyHostName(): string {
        return process.env.DB_PE_PROXY_HOST_NAME!;
      },
      get port(): number {
        return parseInt(process.env.DB_PE_PORT!);
      },
      get dbName(): string {
        return process.env.DB_PE_NAME!;
      },
      get dbUserName(): string {
        return process.env.DB_PE_USER_NAME!;
      },
    };
  }
}