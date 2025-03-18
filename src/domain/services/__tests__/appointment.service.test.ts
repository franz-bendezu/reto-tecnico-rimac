import { AppointmentService } from "../appointment.service";
import { IAppointmentRepository } from "../../../infraestructure/repositories/appointment.repository.interface";
import { IAppointmentCountryProducer } from "../../../infraestructure/messasing/appointment-country.producer.interface";
import { IAppointmentCreate } from "../../interfaces/appointment-create";
import { AppointmentStatusType } from "../../models/appointment-status";

describe("AppointmentService", () => {
    let appointmentService: AppointmentService;
    let mockAppointmentRepository: jest.Mocked<IAppointmentRepository>;
    let mockAppointmentCountryProducer: jest.Mocked<IAppointmentCountryProducer>;

    beforeEach(() => {
        mockAppointmentRepository = {
            create: jest.fn(),
            getAllByEnsuranceId: jest.fn(),
            updateStatusById: jest.fn(),
        };

        mockAppointmentCountryProducer = {
            sendAppointment: jest.fn(),
        };

        appointmentService = new AppointmentService(
            mockAppointmentRepository,
            mockAppointmentCountryProducer
        );
    });

    it("should create an appointment and send it to the producer", async () => {
        const newAppointment: IAppointmentCreate = {
            insuredId: "123",
            scheduleId: 1,
            countryISO: "PE",
        };

        await appointmentService.createAppointment(newAppointment);

        expect(mockAppointmentRepository.create).toHaveBeenCalledWith({
            insuredId: newAppointment.insuredId,
            scheduleId: newAppointment.scheduleId,
            countryISO: newAppointment.countryISO,
            lastStatus: AppointmentStatusType.PENDING,
        });

        expect(mockAppointmentCountryProducer.sendAppointment).toHaveBeenCalledWith(
            newAppointment
        );
    });

    it("should throw an error if repository create fails", async () => {
        const newAppointment: IAppointmentCreate = {
            insuredId: "123",
            scheduleId: 1,
            countryISO: "PE",
        };

        mockAppointmentRepository.create.mockRejectedValue(
            new Error("Repository error")
        );

        await expect(
            appointmentService.createAppointment(newAppointment)
        ).rejects.toThrow("Repository error");
    });

    it("should throw an error if producer sendAppointment fails", async () => {
        const newAppointment: IAppointmentCreate = {
            insuredId: "123",
            scheduleId: 1,
            countryISO: "PE",
        };

        mockAppointmentCountryProducer.sendAppointment.mockRejectedValue(
            new Error("Producer error")
        );

        await expect(
            appointmentService.createAppointment(newAppointment)
        ).rejects.toThrow("Producer error");
    });

    it("should get appointments by insured id", async () => {
        const insuredId = "123";
        const appointments = [
            {
                insuredId,
                scheduleId: 1,
                countryISO: "PE",
                lastStatus: AppointmentStatusType.PENDING,
            },
        ];
        mockAppointmentRepository.getAllByEnsuranceId.mockResolvedValue(
            appointments
        );

        const result = await appointmentService.getAppointmentsByInsuredId(
            insuredId
        );

        expect(result).toEqual(appointments);
        expect(mockAppointmentRepository.getAllByEnsuranceId).toHaveBeenCalledWith(
            insuredId
        );
    });

    it("should complete an appointment", async () => {
        const insuredId = "123";
        const scheduleId = 1;

        await appointmentService.completeAppointment(insuredId, scheduleId);

        expect(mockAppointmentRepository.updateStatusById).toHaveBeenCalledWith(
            insuredId,
            scheduleId,
            AppointmentStatusType.COMPLETED
        );
    });

    it("should throw an error if repository updateStatusById fails", async () => {
        const insuredId = "123";
        const scheduleId = 1;

        mockAppointmentRepository.updateStatusById.mockRejectedValue(
            new Error("Repository error")
        );

        await expect(
            appointmentService.completeAppointment(insuredId, scheduleId)
        ).rejects.toThrow("Repository error");
    });
});
