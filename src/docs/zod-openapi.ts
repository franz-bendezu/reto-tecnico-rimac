import { z } from 'zod';
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Create a registry to register schemas, operations, etc.
export const registry = new OpenAPIRegistry();

// Helper function to register schemas for OpenAPI
export function registerSchema<T extends z.ZodType>(
  schema: T,
  name: string,
  description?: string
): T {
  return registry.register(name, schema.openapi({ description }));
}

// Helper function to register API operations
export function registerOperation(operation: {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  tags?: string[];
  summary?: string;
  description?: string;
  requestSchema?: z.ZodType;
  responseSchema: z.ZodType;
  responseDescription?: string;
  pathParams?: z.ZodType;
  queryParams?: z.ZodType;
}) {
  const { 
    method, 
    path, 
    tags, 
    summary, 
    description, 
    requestSchema, 
    responseSchema, 
    responseDescription,
    pathParams,
    queryParams 
  } = operation;
  
  registry.registerPath({
    method,
    path,
    tags,
    summary,
    description,
    request: requestSchema ? { body: { content: { 'application/json': { schema: requestSchema } } } } : undefined,
    responses: {
      200: {
        description: responseDescription || 'Successful response',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    parameters: [
      ...(pathParams ? Object.entries(pathParams).map(([name, schema]) => ({
        name,
        in: 'path',
        required: true,
        schema,
      })) : []),
      ...(queryParams ? Object.entries(queryParams.shape).map(([name, schema]) => ({
        name,
        in: 'query',
        required: false,
        schema,
      })) : []),
    ],
  });
}
