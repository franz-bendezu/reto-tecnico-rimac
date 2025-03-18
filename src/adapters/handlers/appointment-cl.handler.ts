import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./appointment-cl.handler.provider";

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const appointment = JSON.parse(record.body);
    await appointmentCountryController.createAppointment(appointment);
  }
};
