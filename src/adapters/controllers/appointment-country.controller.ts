
import { IAppointmentCountryService } from "../../domain/services/appointment-country.service.interface";
import { appointmentCreateSchema } from "../schemas/appointment";
import { z } from "zod";

export class CountryAppointmentController {
    constructor(
        private readonly appointmentService: IAppointmentCountryService
    ) { }

    async createAppointment(data: unknown) {
        try {
            const validData = appointmentCreateSchema.parse(data);
            await this.appointmentService.createAppointment(validData);
            return {
                statusCode: 200,
                body: { message: "Appointment created" },
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    statusCode: 400,
                    body: {
                        message: error.message,
                        errors: error.errors.map((e) => e.message),
                    },
                };
            } else {
                console.error("Error in appointment country controller:", error);
                return {
                    statusCode: 500,
                    body: { message: "Internal server error" },
                };
            }
        }
    }
}
