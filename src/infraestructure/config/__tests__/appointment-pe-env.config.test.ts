import { AppointmentPEConfigEnv } from '../appointment-pe-env.config';
import { IDatabaseConfig } from '../appointment-country.config.interface';

describe('AppointmentPEConfigEnv', () => {
    beforeAll(() => {
        process.env.DB_PE_PROXY_HOST_NAME = 'test-proxy-host';
        process.env.DB_PE_PORT = '5432';
        process.env.DB_PE_NAME = 'test-db-name';
        process.env.DB_PE_USER_NAME = 'test-db-user';
        process.env.AWS_REGION = 'us-west-2';
    });

    afterEach(() => {
        delete process.env.DB_PE_PROXY_HOST_NAME;
        delete process.env.DB_PE_PORT;
        delete process.env.DB_PE_NAME;
        delete process.env.DB_PE_USER_NAME;
        delete process.env.AWS_REGION;
    });

    it('should return the correct rdsDatabase configuration', () => {
        const config = new AppointmentPEConfigEnv();
        const rdsDatabase: IDatabaseConfig = config.rdsDatabase;

        expect(rdsDatabase.proxyHostName).toBe('test-proxy-host');
        expect(rdsDatabase.port).toBe(5432);
        expect(rdsDatabase.dbName).toBe('test-db-name');
        expect(rdsDatabase.dbUserName).toBe('test-db-user');
        expect(rdsDatabase.awsRegion).toBe(config.awsRegion);
    });

});