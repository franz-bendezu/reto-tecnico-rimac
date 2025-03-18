import {
  IAppointmentCountryConfig,
  IDatabaseConfig,
  IEventBridgeConfig,
} from "./appointment-country.config.interface";

export abstract class AppointmentCountryEnvConfig implements IAppointmentCountryConfig {
  get awsRegion(): string {
    return process.env.AWS_REGION!;
  }
  get eventBridge(): IEventBridgeConfig {
    return {
      get busName(): string {
        return process.env.EVENT_BUS_NAME!;
      },
      get source(): string {
        return process.env.EVENT_SOURCE!;
      },
      get detailType(): string {
        return process.env.EVENT_DETAIL_TYPE!;
      },
    };
  }

  abstract get rdsDatabase(): IDatabaseConfig;
}
