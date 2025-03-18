import { IAppointmentProducer } from '../../../infraestructure/messasing/appointment.producer.interface';
import { IAppointmentCountryRepository } from '../../../infraestructure/repositories/appointment-country.repository.interface';
import { AppointmentCLService } from '../appointment-cl.service';
import { AppointmentCountryService } from '../appointment.country.service';

describe('AppointmentCLService', () => {
    let service: AppointmentCLService;
    let mockAppointmentCountryRepository: jest.Mocked<IAppointmentCountryRepository>;
    let mockAppointmentCountryProducer: jest.Mocked<IAppointmentProducer>;

    beforeEach(() => {
        mockAppointmentCountryRepository = {
            create: jest.fn(),
        };

        mockAppointmentCountryProducer = {
            sendAppointmentCountry: jest.fn(),
        };
        service = new AppointmentCLService(
            mockAppointmentCountryRepository,
            mockAppointmentCountryProducer
        );

    });

    it('should be an instance of AppointmentCountryService', () => {
        expect(service).toBeInstanceOf(AppointmentCountryService);
    });

    it('should create an instance of AppointmentCLService', () => {
        expect(service).toBeTruthy();
    });
});