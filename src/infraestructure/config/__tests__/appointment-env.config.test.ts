import { AppointmentConfigEnv } from '../appointment-env.config';

describe('AppointmentConfigEnv', () => {

    beforeAll(() => {
        process.env.SNS_TOPIC_ARN = 'test-sns-topic-arn';
        process.env.APPOINTMENT_TABLE = 'APPOINTMENT_TABLE';
        process.env.AWS_REGION = 'AWS_REGION';
    });

    afterAll(() => {
        delete process.env.SNS_TOPIC_ARN;
        delete process.env.APPOINTMENT_TABLE;
        delete process.env.AWS_REGION;
    });

    it('should return the SNS_TOPIC_ARN from environment variables', () => {
        const config = new AppointmentConfigEnv();
        expect(config.snsTopicArn).toBe('test-sns-topic-arn');
        expect(config.dynamoDBTableName).toBe('APPOINTMENT_TABLE');
        expect(config.awsRegion).toBe('AWS_REGION');
    });
});