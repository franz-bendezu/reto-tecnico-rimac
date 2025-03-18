import { AppointmentController } from "../appointment.controller";
import { IAppointmentService } from "../../../domain/services/appointment.service.interface";
import { IAppointmentCreateSchema } from "../../interfaces/appointment.interface";

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

    it("should create an appointment and return status 200", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        appointmentService.createAppointment.mockResolvedValueOnce();

        const result = await appointmentController.createAppointment(data);

        expect(appointmentService.createAppointment).toHaveBeenCalledWith(data);
        expect(result).toEqual({
            statusCode: 200,
            body: { message: "Appointment created" },
        });
    });

    it("should return status 400 if data is invalid", async () => {
        const data = { /* invalid data */ };

        const result = await appointmentController.createAppointment(data);

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBeDefined();
        if ('errors' in result.body) {
            expect(result.body.errors).toBeDefined();
        }
    });

    it("should return status 500 if an unexpected error occurs", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        appointmentService.createAppointment.mockRejectedValueOnce(new Error("Unexpected error"));

        const result = await appointmentController.createAppointment(data);

        expect(result).toEqual({
            statusCode: 500,
            body: { message: "Internal server error" },
        });
    });

    it("should return status 400 if zod validation fails", async () => {
        const data = { insuredId: "12345", scheduleId: "invalid", countryISO: "PE" };

        const result = await appointmentController.createAppointment(data);

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBeDefined();
        if ('errors' in result.body) {
            expect(result.body.errors).toBeDefined();
        }
    });
});