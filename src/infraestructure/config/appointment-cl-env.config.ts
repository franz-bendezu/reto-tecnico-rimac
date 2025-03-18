import { AppointmentCountryEnvConfig } from "./appointment-country-env.config";
import { IDatabaseConfig } from "./appointment-country.config.interface";

export class AppointmentCLConfigEnv extends AppointmentCountryEnvConfig {
  get rdsDatabase(): IDatabaseConfig {
    return {
      get proxyHostName(): string {
        return process.env.DB_CL_PROXY_HOST_NAME!;
      },
      get port(): number {
        return parseInt(process.env.DB_CL_PORT!);
      },
      get dbName(): string {
        return process.env.DB_CL_NAME!;
      },
      get dbUserName(): string {
        return process.env.DB_CL_USER_NAME!;
      },
      get awsRegion(): string {
        return this.awsRegion;
      },
    };
  }
}
