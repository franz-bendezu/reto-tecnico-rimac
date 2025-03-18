import { z } from "zod";
import { appointmentCompleteSchema, appointmentCreateSchema } from "../../../common/adapters/schemas/appointment";
import { IAppointmentService } from "../../domain/services/appointment.service.interface";
import { insuredIdSchema } from "../../../common/adapters/schemas/insured";

export class AppointmentController {
    constructor(private readonly appointmentService: IAppointmentService) { }

    async createAppointment(data: unknown) {
        try {
            const validData = appointmentCreateSchema.parse(data);
            await this.appointmentService.createAppointment(validData);
            return {
                statusCode: 200,
                body: { message: "Appointment created" },
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getAppointmentsByInsuredId(insuredId: unknown) {
        try {
            const ensuredId = insuredIdSchema.parse(insuredId);
            const appointments = await this.appointmentService.getAppointmentsByInsuredId(
                ensuredId
            );
            return {
                statusCode: 200,
                body: appointments,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async completeAppointment(data: unknown) {
        try {
            const { insuredId, scheduleId } = appointmentCompleteSchema.parse(data);
            await this.appointmentService.completeAppointment(insuredId, scheduleId);
            return {
                statusCode: 200,
                body: { message: "Appointment completed" },
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: unknown) {
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: {
                    message: error.message,
                    errors: error.errors.map((e) => e.message),
                },
            };
        } else {
            console.error("Error in appointment controller:", error);
            return {
                statusCode: 500,
                body: { message: "Internal server error" },
            };
        }
    }
}


