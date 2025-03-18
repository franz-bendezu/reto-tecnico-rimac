import { AppointmentCountryEnvConfig } from "./appointment-country-env.config";
import { IDatabaseConfig } from "./appointment-country.config.interface";
import { getRequiredEnv, getRequiredNumericEnv } from "./utils/env-validator";

export class AppointmentCLConfigEnv extends AppointmentCountryEnvConfig {
  override get rdsDatabase(): IDatabaseConfig {
    const getCurrentRegion = (): string => {
      return super.awsRegion;
    };
    return {
      get proxyHostName(): string {
        return getRequiredEnv('DB_CL_PROXY_HOST_NAME');
      },
      get port(): number {
        return getRequiredNumericEnv('DB_CL_PORT');
      },
      get dbName(): string {
        return getRequiredEnv('DB_CL_NAME');
      },
      get dbUserName(): string {
        return getRequiredEnv('DB_CL_USER_NAME');
      },
      get awsRegion(): string {
        return getCurrentRegion();
      },
    };
  }
}
