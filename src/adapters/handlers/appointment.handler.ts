import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { appointmentController } from "./appointment.handler.provider";

export const CREATE_APPOINTMENT_ROUTE = "POST /appointments";
export const GET_ENSURED_APPOINTMENT_LIST = "GET /ensureds/{ensuredId}/appointments";

export const handler: APIGatewayProxyHandlerV2 | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEventV2
) => {
  if ("Records" in event) {
    for (const record of event.Records) {
      await appointmentController.completeAppointment(JSON.parse(record.body));
    }
  } else if (event.routeKey === CREATE_APPOINTMENT_ROUTE) {
    const result = await appointmentController.createAppointment(JSON.parse(event.body || "{}"));
    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };

  } else if (event.routeKey === GET_ENSURED_APPOINTMENT_LIST) {
    try {
      const result = await appointmentController.getAppointmentsByInsuredId(event.pathParameters?.ensuredId);
      return {
        statusCode: result.statusCode,
        body: JSON.stringify(result.body),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid insured ID" }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad request" }),
  };
};
