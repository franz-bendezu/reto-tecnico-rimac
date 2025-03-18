import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./handler-pe.provider";

export const handler: SQSHandler = async (event) => {
  console.log("Processing Peru appointments batch...");
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const recordBody = JSON.parse(record.body);
        const recordMessage = JSON.parse(recordBody.Message);
        await appointmentCountryController.createAppointment(recordMessage);
        console.log("Appointment created successfully for Peru");
      })
    );
  } catch (error) {
    console.error("Error processing Peru appointments:", error);
    // Rethrow to allow AWS to retry processing the batch
    throw error;
  }
};
