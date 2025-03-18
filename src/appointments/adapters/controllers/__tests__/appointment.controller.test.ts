import { AppointmentController } from "../appointment.controller";
import { IAppointmentCreateSchema, IAppointmentCompleteSchema } from "../../../../common/adapters/interfaces/appointment.interface";
import { IAppointment } from "../../../domain/interfaces/appointment";
import { IBaseAppointment } from "../../../../common/domain/interfaces/base-appointment.interface";
import { IAppointmentService } from "../../../domain/services/appointment.service.interface";


describe("AppointmentController", () => {

    let appointmentService: jest.Mocked<IAppointmentService>;
    let appointmentController: AppointmentController;

    beforeEach(() => {
        appointmentService = {
            createAppointment: jest.fn(),
            getAppointmentsByInsuredId: jest.fn(),
            completeAppointment: jest.fn(),
        };
        appointmentController = new AppointmentController(appointmentService);
    });

    it("should create an appointment and return data", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        const saveData: IAppointment = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE",
            lastStatus: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statuses: [{
                status: "pending",
                createdAt: new Date().toISOString()
            }]
        }
        appointmentService.createAppointment.mockResolvedValueOnce(saveData);

        const result = await appointmentController.createAppointment(data);

        expect(appointmentService.createAppointment).toHaveBeenCalledWith(data);
        expect(result).toEqual(saveData);
    });

    it("should throw error if data is invalid", async () => {
        const data = { /* invalid data */ };

        await expect(appointmentController.createAppointment(data)).rejects.toThrow();
    });

    it("should throw service error if service throws", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        const expectedError = new Error("Unexpected error");
        appointmentService.createAppointment.mockRejectedValueOnce(expectedError);

        await expect(appointmentController.createAppointment(data)).rejects.toThrow(expectedError);
    });

    it("should get appointments by insured id and return appointments data", async () => {
        const insuredId = "12345";
        const appointments: IBaseAppointment[] = [{
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE",
            lastStatus: "pending"
        }];
        appointmentService.getAppointmentsByInsuredId.mockResolvedValueOnce(appointments);

        const result = await appointmentController.getAppointmentsByInsuredId(insuredId);

        expect(appointmentService.getAppointmentsByInsuredId).toHaveBeenCalledWith(insuredId);
        expect(result).toEqual(appointments);
    });

    it("should throw error if insured id is invalid", async () => {
        const insuredId = { /* invalid insured id */ };

        await expect(appointmentController.getAppointmentsByInsuredId(insuredId)).rejects.toThrow();
    });

    it("should complete an appointment", async () => {
        const data: IAppointmentCompleteSchema = { insuredId: "12345", scheduleId: 1 };
        appointmentService.completeAppointment.mockResolvedValueOnce();

        await appointmentController.completeAppointment(data);

        expect(appointmentService.completeAppointment).toHaveBeenCalledWith("12345", 1);
    });

    it("should throw error if complete appointment data is invalid", async () => {
        const data = { insuredId: "12345", scheduleId: "invalid" };

        await expect(appointmentController.completeAppointment(data)).rejects.toThrow();
    });

    it("should throw service error during complete appointment", async () => {
        const data = { insuredId: "12345", scheduleId: 1 };
        const expectedError = new Error("Unexpected error");
        appointmentService.completeAppointment.mockRejectedValueOnce(expectedError);

        await expect(appointmentController.completeAppointment(data)).rejects.toThrow(expectedError);
    });
});