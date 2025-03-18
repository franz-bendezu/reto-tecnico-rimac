import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./handler-pe.provider";

export const handler: SQSHandler = async (event) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const appointment = JSON.parse(record.body);
        await appointmentCountryController.createAppointment(appointment);
        console.log("Appointment created successfully for Peru");
      })
    );
  } catch (error) {
    console.error("Error processing Peru appointments:", error);
    // Rethrow to allow AWS to retry processing the batch
    throw error;
  }
};
