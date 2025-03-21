import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { appointmentController } from "./handler.provider";
import { CREATE_APPOINTMENT_ROUTE, GET_INSURED_APPOINTMENT_LIST_ROUTE, INSURED_ID_PARAM } from "./adapters/constants/handler-routes.constant";
import { createBadRequestResponse, createErrorResponse, createSuccessResponse } from "../common/adapters/utils/api-response.utils";
import { ResponseMessage, StatusCode } from "../common/adapters/constants/api-response.constants";

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
      await Promise.all(
        event.Records.map(async (record) => {
          const recordBody = JSON.parse(record.body);
          await appointmentController.completeAppointment(recordBody.detail);
        })
      );
    } else if (event.routeKey === CREATE_APPOINTMENT_ROUTE) {
      const result = await appointmentController.createAppointment(
        JSON.parse(event.body || "{}")
      );
      return createSuccessResponse(
        {
          message: ResponseMessage.APPOINTMENT_IN_PROCESS,
          data: result,
        },
        StatusCode.CREATED
      );
    } else if (event.routeKey === GET_INSURED_APPOINTMENT_LIST_ROUTE) {
      const appointments = await appointmentController.getAppointmentsByInsuredId(
        event.pathParameters?.[INSURED_ID_PARAM]
      );
      return createSuccessResponse({ appointments });
    } else {
      return createBadRequestResponse(ResponseMessage.BAD_REQUEST);
    }
  } catch (error) {
    return createErrorResponse(error);
  }
}
