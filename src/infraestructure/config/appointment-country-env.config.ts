import {
  IAppointmentCountryConfig,
  IDatabaseConfig,
  IEventBridgeConfig,
} from "./appointment-country.config.interface";
import { getRequiredEnv } from "./utils/env-validator";

export abstract class AppointmentCountryEnvConfig implements IAppointmentCountryConfig {
  get awsRegion(): string {
    return getRequiredEnv('AWS_REGION');
  }
  
  get eventBridge(): IEventBridgeConfig {
    return {
      get busName(): string {
        return getRequiredEnv('EVENT_BUS_NAME');
      },
      get source(): string {
        return getRequiredEnv('EVENT_SOURCE');
      },
      get detailType(): string {
        return getRequiredEnv('EVENT_DETAIL_TYPE');
      },
    };
  }

  abstract get rdsDatabase(): IDatabaseConfig;
}
