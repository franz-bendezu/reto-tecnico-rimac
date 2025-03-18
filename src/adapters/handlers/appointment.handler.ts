import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { appointmentCreateSchema } from "../schemas/appointment";
import { insuredIdSchema } from "../schemas/insured";
import { z } from "zod";
import { appointmentService } from "./appointment.handler.provider";

export const handler: APIGatewayProxyHandlerV2 | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEventV2
) => {
  if ("Records" in event) {
    for (const record of event.Records) {
      const { insuredId, scheduleId } = JSON.parse(record.body);

      await appointmentService.completeAppointment(insuredId, scheduleId);
    }
  } else if (event.routeKey === "POST /appointments") {
    try {
      const data = appointmentCreateSchema.parse(
        JSON.parse(event.body || "{}")
      );

      await appointmentService.createAppointment(data);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Appointment created" }),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: error.message,
            errors: error.errors.map((e) => e.message),
          }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  } else if (event.routeKey === "GET /ensureds/{ensuredId}/appointments") {
    try {
      const ensuredId = insuredIdSchema.parse(event.pathParameters?.ensuredId);
      const appointments = await appointmentService.getAppointmentsByInsuredId(
        ensuredId
      );

      return {
        statusCode: 200,
        body: JSON.stringify(appointments),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: error.message }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad request" }),
  };
};
