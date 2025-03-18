import { AppointmentCountryMemoryRepository } from "../appointment-country-memory.repository";
import { IBaseAppointment } from "../../../../common/domain/interfaces/base-appointment.interface";

describe('AppointmentCountryMemoryRepository', () => {
    let repository: AppointmentCountryMemoryRepository;

    beforeEach(() => {
        repository = new AppointmentCountryMemoryRepository();
    });

    afterEach(() => {
        // Limpia el repositorio después de cada prueba
        repository.clear();
    });

    it('should create a new appointment', async () => {
        // Arrange
        const appointment: IBaseAppointment = {
            insuredId: '12345',
            scheduleId: 1,
            countryISO: "PE",
            lastStatus: "pending"
        };

        // Act
        await repository.create(appointment);
        const allAppointments = repository.getAll();

        // Assert
        expect(allAppointments).toHaveLength(1);
        expect(allAppointments[0].insuredId).toBe('12345');
        expect(allAppointments[0].scheduleId).toBe(1);
        expect(allAppointments[0].lastStatus).toBe('pending');
    });

    it('should get appointments by insured ID', async () => {
        // Arrange
        const appointment1: IBaseAppointment = {
            insuredId: '12345',
            scheduleId: 1,
            lastStatus: 'pending',
            countryISO: "PE"
        };

        const appointment2: IBaseAppointment = {
            insuredId: '12345',
            scheduleId: 2,
            lastStatus: 'completed',
            countryISO: "PE"
        };

        const appointment3: IBaseAppointment = {
            insuredId: '67890',
            scheduleId: 3,
            lastStatus: 'pending',
            countryISO: "PE"
        };

        // Act
        await repository.create(appointment1);
        await repository.create(appointment2);
        await repository.create(appointment3);

        const appointmentsForInsured1 = await repository.getByInsuredId('12345');
        const appointmentsForInsured2 = await repository.getByInsuredId('67890');
        const appointmentsForNonExistent = await repository.getByInsuredId('non-existent');

        // Assert
        expect(appointmentsForInsured1).toHaveLength(2);
        expect(appointmentsForInsured2).toHaveLength(1);
        expect(appointmentsForNonExistent).toHaveLength(0);

        // Verify the right appointments were returned
        expect(appointmentsForInsured1[0].scheduleId).toBe(1);
        expect(appointmentsForInsured1[1].scheduleId).toBe(2);
        expect(appointmentsForInsured2[0].scheduleId).toBe(3);
    });

    it('should clear all appointments', async () => {
        // Arrange
        const appointment: IBaseAppointment = {
            insuredId: '12345',
            scheduleId: 1,
            countryISO: "PE",
            lastStatus: "pending"
        };

        await repository.create(appointment);
        expect(repository.getAll()).toHaveLength(1);

        // Act
        repository.clear();

        // Assert
        expect(repository.getAll()).toHaveLength(0);
    });
});
