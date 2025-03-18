import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./handler-pe.provider";

export const handler: SQSHandler = async (event) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const recordBody = JSON.parse(record.body);
        const recordMessage = JSON.parse(recordBody.Message);
        await appointmentCountryController.createAppointment(recordMessage);
      })
    );
  } catch (error) {
    console.error("Error processing Peru appointments:", error);
  }
};
