import type { SQSHandler } from "aws-lambda";
import { z } from "zod";
import { appointmentCreateSchema } from "../schemas/appointment";
import { appointmentService } from "./appointment-cl.handler.provider";

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const appointment = appointmentCreateSchema.parse(
        JSON.parse(record.body)
      );
      await appointmentService.createAppointment(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid appointment data", error.errors);
      } else {
        console.error("Error processing appointment", error);
      }
    }
  }
};
