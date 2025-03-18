import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { openApiDocument } from './openapi-definitions';

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

// Function to generate the HTML for Swagger UI
function getSwaggerHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.20.1/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.20.1/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/docs/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
      });
    };
  </script>
</body>
</html>
  `;
}
