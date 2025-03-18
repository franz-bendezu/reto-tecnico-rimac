import { IAppointmentConfig } from "./appointment.config.interface";

export class AppointmentConfigEnv implements IAppointmentConfig {
  get snsTopicArn(): string {
    if (!process.env.SNS_TOPIC_ARN) {
      throw new Error('SNS_TOPIC_ARN is not defined');
    }
    return process.env.SNS_TOPIC_ARN;
  }

  get dynamoDBTableName(): string {
    if (!process.env.APPOINTMENT_TABLE) {
      throw new Error('APPOINTMENT_TABLE is not defined');
    }
    return process.env.APPOINTMENT_TABLE;
  }
  get awsRegion(): string {
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION is not defined');
    }
    return process.env.AWS_REGION;
  }
}
