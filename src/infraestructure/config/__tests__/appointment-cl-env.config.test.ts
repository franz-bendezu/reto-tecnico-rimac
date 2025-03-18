import { AppointmentCLConfigEnv } from '../appointment-cl-env.config';
describe('AppointmentCLConfigEnv', () => {
    let config: AppointmentCLConfigEnv;

    beforeEach(() => {
        config = new AppointmentCLConfigEnv();
        process.env.DB_CL_PROXY_HOST_NAME = 'test-proxy-host';
        process.env.DB_CL_PORT = '5432';
        process.env.DB_CL_NAME = 'test-db';
        process.env.DB_CL_USER_NAME = 'test-user';
        process.env.AWS_REGION = 'us-west-2';
    });

    afterEach(() => {
        delete process.env.DB_CL_PROXY_HOST_NAME;
        delete process.env.DB_CL_PORT;
        delete process.env.DB_CL_NAME;
        delete process.env.DB_CL_USER_NAME;
        delete process.env.AWS_REGION
    });

    it('should return the correct proxyHostName', () => {
        expect(config.rdsDatabase.proxyHostName).toBe('test-proxy-host');
    });

    it('should return the correct port', () => {
        expect(config.rdsDatabase.port).toBe(5432);
    });

    it('should return the correct dbName', () => {
        expect(config.rdsDatabase.dbName).toBe('test-db');
    });

    it('should return the correct dbUserName', () => {
        expect(config.rdsDatabase.dbUserName).toBe('test-user');
    });

    it('should return the correct awsRegion from the parent class', () => {;
        expect(config.rdsDatabase.awsRegion).toBe('us-west-2');
    });
});