import { CountryAppointmentController } from "../appointment-country.controller";
import { IAppointmentCountryService } from "../../../domain/services/appointment-country.service.interface";
import { IAppointmentCreateSchema } from "../../../../common/adapters/interfaces/appointment.interface";

describe("CountryAppointmentController", () => {
    let appointmentService: jest.Mocked<IAppointmentCountryService>;
    let controller: CountryAppointmentController;

    beforeEach(() => {
        appointmentService = {
            createAppointment: jest.fn()
        };
        controller = new CountryAppointmentController(appointmentService);
    });

    it("should create an appointment", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        appointmentService.createAppointment.mockResolvedValueOnce();

        await controller.createAppointment(data);

        expect(appointmentService.createAppointment).toHaveBeenCalledWith(data);
    });

    it("should throw error if data is invalid", async () => {
        const data = { /* invalid data */ };

        await expect(controller.createAppointment(data)).rejects.toThrow();
    });

    it("should throw service error if service throws", async () => {
        const data: IAppointmentCreateSchema = {
            insuredId: "12345",
            scheduleId: 1,
            countryISO: "PE"
        };
        const expectedError = new Error("Service error");
        appointmentService.createAppointment.mockRejectedValueOnce(expectedError);

        await expect(controller.createAppointment(data)).rejects.toThrow(expectedError);
    });
});