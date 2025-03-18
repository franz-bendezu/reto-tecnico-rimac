import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { appointmentController } from "./handler.provider";

export const CREATE_APPOINTMENT_ROUTE = "POST /appointments";
export const GET_ENSURED_APPOINTMENT_LIST =
  "GET /ensureds/{ensuredId}/appointments";

export function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2>;
export function handler(event: SQSEvent): Promise<void | SQSBatchResponse>;
export async function handler(
  event: SQSEvent | APIGatewayProxyEventV2
): Promise<void | APIGatewayProxyResultV2 | SQSBatchResponse> {
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
}
