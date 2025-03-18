
import mysql from 'mysql2/promise';
import { Signer } from '@aws-sdk/rds-signer';
import { IBaseAppointment } from '../../../domain/interfaces/appointment';
import { IDatabaseConfig } from '../../config/appointment-country.config.interface';
import { AppointmentCountryRDSRepository } from '../appointment-country-rds.repository';
import { Connection } from 'mysql2';

jest.mock('mysql2/promise');
jest.mock('@aws-sdk/rds-signer');

describe('AppointmentCountryRDSRepository', () => {
    let repository: AppointmentCountryRDSRepository;
    let config: IDatabaseConfig;

    beforeEach(() => {
        config = {
            proxyHostName: 'test-host',
            port: 3306,
            dbUserName: 'test-user',
            dbName: 'test-db',
            awsRegion: 'test-region',
        };
        repository = new AppointmentCountryRDSRepository(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an auth token', async () => {
        const mockSigner = {
            getAuthToken: jest.fn().mockResolvedValue('test-token'),
        };
        (Signer as jest.Mock).mockImplementation(() => mockSigner);

        const token = await repository.createAuthToken();

        expect(mockSigner.getAuthToken).toHaveBeenCalled();
        expect(token).toBe('test-token');
    });

    it('should create a database connection', async () => {
        const mockConnection = {
            execute: jest.fn(),
            commit: jest.fn(),
            end: jest.fn(),
        } as unknown as Connection;
        (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
        jest.spyOn(repository, 'createAuthToken').mockResolvedValue('test-token');

        const connection = await repository.dbOps();

        expect(repository.createAuthToken).toHaveBeenCalled();
        expect(mysql.createConnection).toHaveBeenCalledWith({
            host: 'test-host',
            user: 'test-user',
            password: 'test-token',
            database: 'test-db',
            ssl: 'Amazon RDS',
        });
        expect(connection).toBe(mockConnection);
    });

    it('should insert an appointment into the database', async () => {
        const mockConnection = {
            execute: jest.fn(),
            commit: jest.fn(),
            end: jest.fn(),
        } as unknown as Connection;
        (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

        const appointment: IBaseAppointment = {
            insuredId: '123',
            scheduleId: 1,
            countryISO: 'PE',
            lastStatus: 'pending'
        };

        await repository.create(appointment);

        expect(mockConnection.execute).toHaveBeenCalledWith(
            'INSERT INTO appointments (insured_id, schedule_id, status, date) VALUES (?, ?, ?, ?)',
            ['123', 1, 'pending']
        );
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.end).toHaveBeenCalled();
    });
});