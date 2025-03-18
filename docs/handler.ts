import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { openApiDocument } from './openapi-definitions';
import { getSwaggerHtml } from './swagger';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (event.rawPath === '/docs') {
    // Return the HTML for Swagger UI
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: getSwaggerHtml(),
    };
  } else if (event.rawPath === '/docs/openapi.json') {
    // Return the OpenAPI JSON
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openApiDocument),
    };
  }

  // 404 for all other paths
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not found' }),
  };
};
