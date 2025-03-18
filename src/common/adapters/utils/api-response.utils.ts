import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { z } from "zod";
import { ResponseMessage, StatusCode } from "../constants/api-response.constants";

/**
 * Generates a standardized success response
 */
export const createSuccessResponse = (
  data: any,
  statusCode: number = StatusCode.OK
): APIGatewayProxyStructuredResultV2 => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

/**
 * Generates a standardized bad request response
 */
export const createBadRequestResponse = (
  message: string = ResponseMessage.BAD_REQUEST,
  errors?: string[]
): APIGatewayProxyStructuredResultV2 => {
  return {
    statusCode: StatusCode.BAD_REQUEST,
    body: JSON.stringify({
      message,
      errors,
    }),
  };
};

/**
 * Generates a standardized error response
 */
export const createErrorResponse = (
  error: unknown
): APIGatewayProxyStructuredResultV2 => {
  if (error instanceof z.ZodError) {
    return createBadRequestResponse(
      error.message,
      error.errors.map((e) => e.message)
    );
  }

  console.error("Error:", error);

  return {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    body: JSON.stringify({
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
    }),
  };
};

/**
 * Handler wrapper for API Gateway handlers
 */
export const apiHandler = (handler: (event: any) => Promise<any>) => {
  return async (event: any): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
      const result = await handler(event);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
};
