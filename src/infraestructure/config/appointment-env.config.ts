import { IAppointmentConfig } from "./appointment.config.interface";

export class AppointmentConfigEnv implements IAppointmentConfig {
  get snsTopicArn(): string {
    return process.env.SNS_TOPIC_ARN!;
  }

  get dynamoDBTableName(): string {
    return process.env.APPOINTMENT_TABLE!;
  }
  get awsRegion(): string {
    return process.env.AWS_REGION!;
  }
}
