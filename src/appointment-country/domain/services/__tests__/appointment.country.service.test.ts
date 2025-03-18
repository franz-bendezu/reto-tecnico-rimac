import { AppointmentCountryService } from '../appointment.country.service';
import { IAppointmentProducer } from '../../../infraestructure/messasing/appointment.producer.interface';
import { IAppointmentCountryRepository } from '../../../infraestructure/repositories/appointment-country.repository.interface';
import { IAppointmentCreate } from '../../../../common/domain/interfaces/appointment-create';
import { AppointmentStatusType } from '../../../../common/domain/models/appointment-status';

describe('AppointmentCountryService', () => {
    let appointmentCountryService: AppointmentCountryService;
    let mockAppointmentCountryRepository: jest.Mocked<IAppointmentCountryRepository>;
    let mockAppointmentCountryProducer: jest.Mocked<IAppointmentProducer>;

    beforeEach(() => {
        mockAppointmentCountryRepository = {
            create: jest.fn(),
        };

        mockAppointmentCountryProducer = {
            sendAppointmentCountry: jest.fn(),
        };

        appointmentCountryService = new (class extends AppointmentCountryService {
            constructor() {
                super(mockAppointmentCountryRepository, mockAppointmentCountryProducer);
            }
        })();
    });

    it('should create an appointment with PENDING status and send it to the producer', async () => {
        const appointment: IAppointmentCreate = {
            insuredId: '123',
            scheduleId: 1,
            countryISO: 'PE'
        };

        await appointmentCountryService.createAppointment(appointment);

        expect(mockAppointmentCountryRepository.create).toHaveBeenCalledWith({
            ...appointment,
            lastStatus: AppointmentStatusType.PENDING,
        });
        expect(mockAppointmentCountryProducer.sendAppointmentCountry).toHaveBeenCalledWith(appointment);
    });
});