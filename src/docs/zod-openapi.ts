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

// The registerOperation function has been removed as we now use registry.registerPath directly
