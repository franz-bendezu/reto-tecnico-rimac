import { AppointmentConfigEnv } from '../appointment-env.config';

describe('AppointmentConfigEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = process.env;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return the SNS_TOPIC_ARN from environment variables', () => {
        process.env.SNS_TOPIC_ARN = 'test-sns-topic-arn';
        const config = new AppointmentConfigEnv();
        expect(config.snsTopicArn).toBe('test-sns-topic-arn');
    });

    it('should throw an error if SNS_TOPIC_ARN is not defined', () => {
        delete process.env.SNS_TOPIC_ARN;
        const config = new AppointmentConfigEnv();
        expect(() => config.snsTopicArn).toThrow();
    });
});