import { AppointmentController } from "../appointment.controller";
import { IAppointmentCreateSchema, IAppointmentCompleteSchema } from "../../../../common/adapters/interfaces/appointment.interface";
import { IAppointment, IBaseAppointment } from "../../../../common/domain/interfaces/appointment";
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

    it("should create an appointment and return status 200", async () => {
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
        expect(result).toEqual({
            statusCode: 200,
            body: { message: "El agendamiento está en proceso", data: saveData },
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

    it("should get appointments by insured id and return status 200", async () => {
        const insuredId = "12345";
        const appointments: IBaseAppointment[] = [{
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "ES",
            lastStatus: "pending"
        }];
        appointmentService.getAppointmentsByInsuredId.mockResolvedValueOnce(appointments);

        const result = await appointmentController.getAppointmentsByInsuredId(insuredId);

        expect(appointmentService.getAppointmentsByInsuredId).toHaveBeenCalledWith(insuredId);
        expect(result).toEqual({
            statusCode: 200,
            body: { appointments },
        });
    });

    it("should return status 400 if insured id is invalid", async () => {
        const insuredId = { /* invalid insured id */ };

        const result = await appointmentController.getAppointmentsByInsuredId(insuredId);

        expect(result.statusCode).toBe(400);
        if ('message' in result.body) {
            expect(result.body.message).toBeDefined();
        }
        if ('errors' in result.body) {
            expect(result.body.errors).toBeDefined();
        }
    });

    it("should complete an appointment and return status 200", async () => {
        const data: IAppointmentCompleteSchema = { insuredId: "12345", scheduleId: 1 };
        appointmentService.completeAppointment.mockResolvedValueOnce();

        const result = await appointmentController.completeAppointment(data);

        expect(appointmentService.completeAppointment).toHaveBeenCalledWith("12345", 1);
        expect(result).toEqual({
            statusCode: 200,
            body: { message: "Appointment completed" },
        });
    });

    it("should return status 400 if complete appointment data is invalid", async () => {
        const data = { insuredId: "12345", scheduleId: "invalid" };

        const result = await appointmentController.completeAppointment(data);

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBeDefined();
        if ('errors' in result.body) {
            expect(result.body.errors).toBeDefined();
        }
    });

    it("should return status 500 if an unexpected error occurs during complete appointment", async () => {
        const data = { insuredId: "12345", scheduleId: 1 };
        appointmentService.completeAppointment.mockRejectedValueOnce(new Error("Unexpected error"));

        const result = await appointmentController.completeAppointment(data);

        expect(result).toEqual({
            statusCode: 500,
            body: { message: "Internal server error" },
        });
    });
});