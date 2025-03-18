import { IAppointmentConfig } from "./appointment.config.interface";
import { getRequiredEnv } from "./utils/env-validator";

export class AppointmentConfigEnv implements IAppointmentConfig {
  get snsTopicArn(): string {
    return getRequiredEnv('SNS_TOPIC_ARN');
  }

  get dynamoDBTableName(): string {
    return getRequiredEnv('APPOINTMENT_TABLE');
  }
  
  get awsRegion(): string {
    return getRequiredEnv('AWS_REGION');
  }
}
