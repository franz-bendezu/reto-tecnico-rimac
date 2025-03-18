import { AppointmentCountryEnvConfig } from "./appointment-country-env.config";
import { IDatabaseConfig } from "./appointment-country.config.interface";

export class AppointmentCLConfigEnv extends AppointmentCountryEnvConfig {
  override get rdsDatabase(): IDatabaseConfig {
    const awsRegion = super.awsRegion;
    return {
      get proxyHostName(): string {
        if (!process.env.DB_CL_PROXY_HOST_NAME) {
          throw new Error("DB_CL_PROXY_HOST_NAME is not defined");
        }
        return process.env.DB_CL_PROXY_HOST_NAME;
      },
      get port(): number {
        if (!process.env.DB_CL_PORT) {
          throw new Error("DB_CL_PORT is not defined");
        }
        return parseInt(process.env.DB_CL_PORT!);
      },
      get dbName(): string {
        if (!process.env.DB_CL_NAME) {
          throw new Error("DB_CL_NAME is not defined");
        }
        return process.env.DB_CL_NAME!;
      },
      get dbUserName(): string {
        if (!process.env.DB_CL_USER_NAME) {
          throw new Error("DB_CL_USER_NAME is not defined");
        }
        return process.env.DB_CL_USER_NAME!;
      },
      get awsRegion(): string {
        return awsRegion;
      },
    };
  }
}
