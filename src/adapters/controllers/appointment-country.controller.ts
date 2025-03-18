
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
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Invalid appointment data", error.errors);
            } else {
                console.error("Error processing appointment", error);
            }
            return false;
        }
    }
}
