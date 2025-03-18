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
      const { insuredId, scheduleId } = JSON.parse(record.body);
      await appointmentController.completeAppointment(insuredId, scheduleId);
    }
  } else if (event.routeKey === "POST /appointments") {
    const data = JSON.parse(event.body || "{}");
    const result = await appointmentController.createAppointment(data);
    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };

  } else if (event.routeKey === "GET /ensureds/{ensuredId}/appointments") {
    try {
      const ensuredId = insuredIdSchema.parse(event.pathParameters?.ensuredId);
      const result = await appointmentController.getAppointmentsByInsuredId(ensuredId);
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
