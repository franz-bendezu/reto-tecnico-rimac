import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { appointmentController } from "./appointment.handler.provider";

export const CREATE_APPOINTMENT_ROUTE = "POST /appointments";
export const GET_ENSURED_APPOINTMENT_LIST =
  "GET /ensureds/{ensuredId}/appointments";

export const handler: APIGatewayProxyHandlerV2 | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEventV2
) => {
  if ("Records" in event) {
    for (const record of event.Records) {
      await appointmentController.completeAppointment(JSON.parse(record.body));
    }
  } else if (event.routeKey === CREATE_APPOINTMENT_ROUTE) {
    const result = await appointmentController.createAppointment(
      JSON.parse(event.body || "{}")
    );
    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    } satisfies APIGatewayProxyResultV2;
  } else if (event.routeKey === GET_ENSURED_APPOINTMENT_LIST) {
    const result = await appointmentController.getAppointmentsByInsuredId(
      event.pathParameters?.ensuredId
    );
    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad request" }),
  } satisfies APIGatewayProxyResultV2;
};
