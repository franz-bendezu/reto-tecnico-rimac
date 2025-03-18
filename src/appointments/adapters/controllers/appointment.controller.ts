import { z } from "zod";
import { appointmentCompleteSchema, appointmentCreateSchema } from "../../../common/adapters/schemas/appointment";
import { IAppointmentService } from "../../domain/services/appointment.service.interface";
import { insuredIdSchema } from "../../../common/adapters/schemas/insured";

export class AppointmentController {
    constructor(private readonly appointmentService: IAppointmentService) { }

    async createAppointment(data: unknown) {
        const validData = appointmentCreateSchema.parse(data);
        const result = await this.appointmentService.createAppointment(validData);

        return result;
    }

    async getAppointmentsByInsuredId(insuredId: unknown) {
        console.log({ insuredId });
        const appointments = await this.appointmentService.getAppointmentsByInsuredId(
            insuredIdSchema.parse(insuredId)
        );

        return appointments;
    }

    async completeAppointment(data: unknown) {
        const { insuredId, scheduleId } = appointmentCompleteSchema.parse(data);
        await this.appointmentService.completeAppointment(insuredId, scheduleId);
    }
}


