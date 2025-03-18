import { IAppointmentProducer } from '../../../infraestructure/messasing/appointment.producer.interface';
import { IAppointmentCountryRepository } from '../../../infraestructure/repositories/appointment-country.repository.interface';
import { AppointmentPEService } from '../appointment-pe.service';
import { AppointmentCountryService } from '../appointment.country.service';

describe('AppointmentPEService', () => {
    let service: AppointmentPEService;
    let mockAppointmentCountryRepository: jest.Mocked<IAppointmentCountryRepository>;
    let mockAppointmentCountryProducer: jest.Mocked<IAppointmentProducer>;

    beforeEach(() => {
        mockAppointmentCountryRepository = {
            create: jest.fn(),
        };

        mockAppointmentCountryProducer = {
            sendAppointmentCountry: jest.fn(),
        };
        service = new AppointmentPEService(
            mockAppointmentCountryRepository,
            mockAppointmentCountryProducer
        );
    });

    it('should be an instance of AppointmentCountryService', () => {
        expect(service).toBeInstanceOf(AppointmentCountryService);
    });

    it('should create an instance of AppointmentPEService', () => {
        expect(service).toBeTruthy();
    });
});