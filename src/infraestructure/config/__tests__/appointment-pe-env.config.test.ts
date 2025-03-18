import { AppointmentPEConfigEnv } from '../appointment-pe-env.config';
import { IDatabaseConfig } from '../appointment-country.config.interface';

describe('AppointmentPEConfigEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = process.env;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should return the correct rdsDatabase configuration', () => {
        process.env.DB_PE_PROXY_HOST_NAME = 'test-proxy-host';
        process.env.DB_PE_PORT = '5432';
        process.env.DB_PE_NAME = 'test-db-name';
        process.env.DB_PE_USER_NAME = 'test-db-user';
        
        const config = new AppointmentPEConfigEnv();
        const rdsDatabase: IDatabaseConfig = config.rdsDatabase;

        expect(rdsDatabase.proxyHostName).toBe('test-proxy-host');
        expect(rdsDatabase.port).toBe(5432);
        expect(rdsDatabase.dbName).toBe('test-db-name');
        expect(rdsDatabase.dbUserName).toBe('test-db-user');
        expect(rdsDatabase.awsRegion).toBe(config.awsRegion);
    });

    it('should throw an error if environment variables are not set', () => {
        delete process.env.DB_PE_PROXY_HOST_NAME;
        delete process.env.DB_PE_PORT;
        delete process.env.DB_PE_NAME;
        delete process.env.DB_PE_USER_NAME;

        const config = new AppointmentPEConfigEnv();

        expect(() => config.rdsDatabase.proxyHostName).toThrow();
        expect(() => config.rdsDatabase.port).toThrow();
        expect(() => config.rdsDatabase.dbName).toThrow();
        expect(() => config.rdsDatabase.dbUserName).toThrow();
    });
});