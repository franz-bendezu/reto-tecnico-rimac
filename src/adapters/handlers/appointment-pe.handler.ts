import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./appointment-pe.handler.provider";

export const handler: SQSHandler = async (event) => {
  await Promise.all(
    event.Records.map(async (record) => {
      const appointment = JSON.parse(record.body);
      await appointmentCountryController.createAppointment(appointment);
    })
  );
};
