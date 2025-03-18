import { AppointmentService } from "../appointment.service";
import { IAppointmentRepository } from "../../../infraestructure/repositories/appointment.repository.interface";
import { IAppointmentCountryProducer } from "../../../infraestructure/messasing/appointment-country.producer.interface";
import { IAppointmentCreate } from "../../../../common/domain/interfaces/appointment-create";
import { AppointmentStatusType } from "../../../../common/domain/models/appointment-status";
import { IBaseAppointment } from "../../../../common/domain/interfaces/base-appointment.interface";

describe("AppointmentService", () => {
    let appointmentService: AppointmentService;
    let mockAppointmentRepository: jest.Mocked<IAppointmentRepository>;
    let mockAppointmentCountryProducer: jest.Mocked<IAppointmentCountryProducer>;

    beforeEach(() => {
        mockAppointmentRepository = {
            create: jest.fn(),
            getAllByEnsuranceId: jest.fn(),
            updateAppointment: jest.fn(),
            getAppointmentDetail: jest.fn(),
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
        const appointments: IBaseAppointment[] = [
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

        mockAppointmentRepository.getAppointmentDetail.mockResolvedValue({
            insuredId,
            scheduleId,
            lastStatus: AppointmentStatusType.PENDING,
            statuses: [
                {
                    status: AppointmentStatusType.PENDING,
                    createdAt: "",
                },
            ],
            createdAt: "",
            updatedAt: "",
            countryISO: "PE",
        });

        await appointmentService.completeAppointment(insuredId, scheduleId);

        expect(mockAppointmentRepository.updateAppointment).toHaveBeenCalledWith({
            insuredId,
            scheduleId,
            lastStatus: AppointmentStatusType.COMPLETED,
            statuses: [
                {
                    status: AppointmentStatusType.PENDING,
                    createdAt: "",
                },
                {
                    status: AppointmentStatusType.COMPLETED,
                    createdAt: expect.any(String),
                },
            ],
            createdAt: "",
            updatedAt: expect.any(String),
            countryISO: "PE",
        });
    });

    it("should throw an error if appointment not found", async () => {
        const insuredId = "123";
        const scheduleId = 1;

        mockAppointmentRepository.getAppointmentDetail.mockResolvedValue(null);

        await expect(
            appointmentService.completeAppointment(insuredId, scheduleId)
        ).rejects.toThrow("Appointment not found");
    });

    it("should throw an error if repository updateStatusById fails", async () => {
        const insuredId = "123";
        const scheduleId = 1;

        mockAppointmentRepository.getAppointmentDetail.mockResolvedValue({
            insuredId,
            scheduleId,
            lastStatus: AppointmentStatusType.PENDING,
            statuses: [
                {
                    status: AppointmentStatusType.PENDING,
                    createdAt: "",
                },
            ],
            createdAt: "",
            updatedAt: "",
            countryISO: "PE",
        });

        mockAppointmentRepository.updateAppointment.mockRejectedValue(
            new Error("Repository error")
        );

        await expect(
            appointmentService.completeAppointment(insuredId, scheduleId)
        ).rejects.toThrow("Repository error");
    });
});
