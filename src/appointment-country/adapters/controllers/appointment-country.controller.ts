import { IAppointmentCountryService } from "../../domain/services/appointment-country.service.interface";
import { appointmentCreateSchema } from "../../../common/adapters/schemas/appointment";

export class CountryAppointmentController {
    constructor(
        private readonly appointmentService: IAppointmentCountryService
    ) { }

    async createAppointment(data: unknown) {
        const validData = appointmentCreateSchema.parse(data);
        await this.appointmentService.createAppointment(validData);
    }
}
