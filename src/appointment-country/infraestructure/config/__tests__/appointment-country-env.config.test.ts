import { AppointmentCountryEnvConfig } from '../appointment-country-env.config';
import { IDatabaseConfig } from '../appointment-country.config.interface';

class AppointmentCountryTestConfig extends AppointmentCountryEnvConfig {
    get rdsDatabase(): IDatabaseConfig {
        throw new Error('Method not implemented.');
    }
}

describe('AppointmentCountryEnvConfig', () => {
    let config: AppointmentCountryTestConfig;

    beforeEach(() => {
        config = new AppointmentCountryTestConfig();
        process.env.AWS_REGION = 'us-west-2';
        process.env.EVENT_BUS_NAME = 'test-bus';
        process.env.EVENT_SOURCE = 'test-source';
        process.env.EVENT_DETAIL_TYPE = 'test-detail-type';
    });

    afterEach(() => {
        delete process.env.AWS_REGION;
        delete process.env.EVENT_BUS_NAME;
        delete process.env.EVENT_SOURCE;
        delete process.env.EVENT_DETAIL_TYPE;
    });

    it('should return the correct AWS region', () => {
        expect(config.awsRegion).toBe('us-west-2');
    });

    it('should return the correct event bridge configuration', () => {
        const eventBridgeConfig = config.eventBridge;
        expect(eventBridgeConfig.busName).toBe('test-bus');
        expect(eventBridgeConfig.source).toBe('test-source');
        expect(eventBridgeConfig.detailType).toBe('test-detail-type');
    });

    it('should throw an error when calling the abstract method', () => {
        expect(() => config.rdsDatabase).toThrow('Method not implemented.');
    });
});