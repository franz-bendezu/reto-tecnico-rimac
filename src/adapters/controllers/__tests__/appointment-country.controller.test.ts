import { CountryAppointmentController } from "../appointment-country.controller";
import { IAppointmentCountryService } from "../../../domain/services/appointment-country.service.interface";
import { IAppointmentCreateSchema } from "../../interfaces/appointment.interface";

describe("CountryAppointmentController", () => {
    let controller: CountryAppointmentController;
    let appointmentService: jest.Mocked<IAppointmentCountryService>;

    beforeEach(() => {
        appointmentService = {
            createAppointment: jest.fn(),
        };
        controller = new CountryAppointmentController(appointmentService);
    });

    it("should create an appointment successfully", async () => {
        const validData: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        appointmentService.createAppointment.mockResolvedValueOnce(undefined);

        const result = await controller.createAppointment(validData);

        expect(result).toEqual({
            statusCode: 200,
            body: { message: "Appointment created" },
        });
        expect(appointmentService.createAppointment).toHaveBeenCalledWith(validData);
    });

    it("should return 400 if data is invalid", async () => {
        const invalidData = { /* invalid data */ };
        const result = await controller.createAppointment(invalidData);

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBeDefined();
        if ('errors' in result.body) {
            expect(result.body.errors).toBeDefined();
        }
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const validData = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        const unexpectedError = new Error("Unexpected error");
        appointmentService.createAppointment.mockRejectedValueOnce(unexpectedError);

        const result = await controller.createAppointment(validData);

        expect(result).toEqual({
            statusCode: 500,
            body: { message: "Internal server error" },
        });
    });
});