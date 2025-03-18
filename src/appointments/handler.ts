import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { appointmentController } from "./handler.provider";
import { CREATE_APPOINTMENT_ROUTE, GET_INSURED_APPOINTMENT_LIST_ROUTE } from "./adapters/constants/handler-routes.constant";
import { createBadRequestResponse, createErrorResponse, createSuccessResponse } from "../common/adapters/utils/api-response.utils";

/** Este handler es el encargado de recibir los eventos de la cola de SQS
 * y de las peticiones HTTP para crear y obtener citas médicas.
 * Para las peticiones HTTP, se encarga de llamar al controlador de citas médicas para procesarlas.
 * Para los eventos de la cola de SQS, se encarga de llamar al controlador de citas médicas para completar la cita.
 * @param event - Evento de la cola de SQS o petición HTTP
 * @returns Respuesta de la petición HTTP o void para eventos de la cola de SQS
 * @throws Error si el evento no es válido
 */
export function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2>;
export function handler(event: SQSEvent): Promise<void | SQSBatchResponse>;
export async function handler(
  event: SQSEvent | APIGatewayProxyEventV2
): Promise<void | APIGatewayProxyResultV2 | SQSBatchResponse> {
  try {
    if ("Records" in event) {
      for (const record of event.Records) {
        await appointmentController.completeAppointment(JSON.parse(record.body));
      }
    } else if (event.routeKey === CREATE_APPOINTMENT_ROUTE) {
      const result = await appointmentController.createAppointment(
        JSON.parse(event.body || "{}")
      );
      return createSuccessResponse(
        {
          message: "El agendamiento está en proceso",
          data: result,
        },
        201
      );
    } else if (event.routeKey === GET_INSURED_APPOINTMENT_LIST_ROUTE) {
      const appointments = await appointmentController.getAppointmentsByInsuredId(
        event.pathParameters?.ensuredId
      );
      return createSuccessResponse({ appointments });
    } else {
      return createBadRequestResponse("Bad request");
    }
  } catch (error) {
    // Only return error response for API Gateway events
    if (!("Records" in event)) {
      return createErrorResponse(error);
    }
    // Rethrow for SQS events to allow AWS to retry
    throw error;
  }
}
