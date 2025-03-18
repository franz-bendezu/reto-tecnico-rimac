import { AppointmentCountryEnvConfig } from "./appointment-country-env.config";
import { IDatabaseConfig } from "./appointment-country.config.interface";
import { getRequiredEnv, getRequiredNumericEnv } from "./utils/env-validator";

export class AppointmentPEConfigEnv extends AppointmentCountryEnvConfig {
  get rdsDatabase(): IDatabaseConfig {
    const awsRegion = super.awsRegion;
    return {
      get proxyHostName(): string {
        return getRequiredEnv('DB_PE_PROXY_HOST_NAME');
      },
      get port(): number {
        return getRequiredNumericEnv('DB_PE_PORT');
      },
      get dbName(): string {
        return getRequiredEnv('DB_PE_NAME');
      },
      get dbUserName(): string {
        return getRequiredEnv('DB_PE_USER_NAME');
      },
      get awsRegion(): string {
        return awsRegion;
      },
    };
  }
}