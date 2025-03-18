import type { SQSHandler } from "aws-lambda";
import { appointmentCountryController } from "./handler-cl.provider";

export const handler: SQSHandler = async (event) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const recordBody = JSON.parse(record.body);
        const recordMessage = JSON.parse(recordBody.Message);
        await appointmentCountryController.createAppointment(recordMessage);
        console.log("Appointment created successfully for Chile");
      })
    );
  } catch (error) {
    console.error("Error processing Chile appointments:", error);
    // Rethrow to allow AWS to retry processing the batch
    throw error;
  }
};
