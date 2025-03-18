import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { insuredIdSchema } from "../schemas/insured";
import { appointmentController } from "./appointment.handler.provider";

export const handler: APIGatewayProxyHandlerV2 | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEventV2
) => {
  if ("Records" in event) {
    for (const record of event.Records) {
      await appointmentController.completeAppointment(JSON.parse(record.body));
    }
  } else if (event.routeKey === "POST /appointments") {
    const result = await appointmentController.createAppointment(JSON.parse(event.body || "{}"));
    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };

  } else if (event.routeKey === "GET /ensureds/{ensuredId}/appointments") {
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
