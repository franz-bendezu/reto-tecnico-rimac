import { z } from 'zod';
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

/**
 * Registro para almacenar esquemas, operaciones y definiciones de OpenAPI.
 * Este registro se utiliza para generar la documentación OpenAPI de la API.
 */
export const registry = new OpenAPIRegistry();

/**
 * Registra un esquema Zod en el registro OpenAPI.
 * 
 * @param {z.ZodType} schema - El esquema Zod a registrar.
 * @param {string} name - Nombre del esquema para la documentación.
 * @param {string} [description] - Descripción opcional del esquema.
 * @returns {T} El esquema registrado.
 * @template T - Tipo que extiende de z.ZodType
 */
export function registerSchema<T extends z.ZodType>(
  schema: T,
  name: string,
  description?: string
): T {
  return registry.register(name, schema.openapi({ description }));
}
