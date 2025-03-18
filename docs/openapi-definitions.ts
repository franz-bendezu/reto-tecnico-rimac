import { z } from 'zod';
import { appointmentCreateSchema, appointmentCompleteSchema, scheduleIdSchema, countryISOSchema } from '../src/common/adapters/schemas/appointment';
import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CREATE_APPOINTMENT_PATH, INSURED_APPOINTMENT_LIST_PATH } from "../src/appointments/adapters/constants/handler-routes.constant";
import { insuredIdSchema } from '../src/common/adapters/schemas/insured';
import { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator';

/**
 * Registros de esquemas para la documentación OpenAPI
 * Estos esquemas definen la estructura de los datos utilizados en la API
 */


// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

export const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'https://xxxxx.us-east-1.amazonaws.com'

/**
 * Registro para almacenar esquemas, operaciones y definiciones de OpenAPI.
 * Este registro se utiliza para generar la documentación OpenAPI de la API.
 */
export const registry = new OpenAPIRegistry();

/**
 * Esquema para la creación de citas
 * Define la estructura de datos requerida para crear una nueva cita
 */
const AppointmentCreateSchema = registry.register(
  'AppointmentCreate',
  appointmentCreateSchema.openapi({ description: 'Esquema para crear una nueva cita' })
);

/**
 * Esquema para completar citas
 * Define la estructura de datos requerida para marcar una cita como completada
 */
const AppointmentCompleteSchema = registry.register(
  'AppointmentComplete',
  appointmentCompleteSchema.openapi({ description: 'Esquema para completar una cita' })
);

/**
 * Esquema de respuesta para citas individuales
 * Define la estructura de los datos devueltos para una cita
 */
const AppointmentResponseSchema = registry.register(
  'AppointmentResponse',
  z.object({
    insuredId: insuredIdSchema,
    scheduleId: scheduleIdSchema,
    countryISO: countryISOSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    lastStatus: z.string(),
    statuses: z.array(
      z.object({
        status: z.string(),
        createdAt: z.string(),
      })
    ),
  }).openapi({ description: 'Esquema para respuesta de cita' })
);

/**
 * Esquema de respuesta para listas de citas
 * Define la estructura de los datos devueltos para múltiples citas
 */
const AppointmentListResponseSchema = registry.register(
  'AppointmentListResponse',
  z.array(AppointmentResponseSchema).openapi({ description: 'Esquema para respuesta de lista de citas' })
);

/**
 * Esquema para respuestas de error
 * Define la estructura de los mensajes de error devueltos por la API
 */
const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    message: z.string(),
  }).openapi({ description: 'Esquema para respuesta de error' })
);

/**
 * Registro de operaciones de API
 * Estas definiciones configuran los endpoints disponibles en la API
 */

/**
 * Endpoint para crear una cita
 * Permite crear una nueva cita con los datos del asegurado
 */
registry.registerPath({
  method: 'post',
  path: CREATE_APPOINTMENT_PATH,
  summary: 'Crear una nueva cita',
  description: 'Endpoint para crear una nueva cita para una persona asegurada',
  tags: ['Citas'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AppointmentCreateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'La cita creada',
      content: {
        'application/json': {
          schema: AppointmentResponseSchema,
        },
      },
    },
    400: {
      description: 'Datos inválidos',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  }
});

/**
 * Endpoint para obtener citas por ID del asegurado
 * Permite consultar todas las citas asociadas a un asegurado específico
 */
registry.registerPath({
  method: 'get',
  path: INSURED_APPOINTMENT_LIST_PATH,
  summary: 'Obtener citas por ID del asegurado',
  description: 'Recuperar todas las citas para una persona asegurada específica',
  tags: ['Citas'],
  request: {
    params: z.object({
      insuredId: insuredIdSchema,
    }),
  },
  responses: {
    200: {
      description: 'Lista de citas para la persona asegurada',
      content: {
        'application/json': {
          schema: AppointmentListResponseSchema,
        },
      },
    }, 400: {
      description: 'Datos inválidos',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  }
});

export const OPEN_API_CONFIG: OpenAPIObjectConfig = {
  info: {
    title: 'API de Servicio de Citas',
    version: '1.0.0',
    description: 'API para gestionar citas',
  },
  servers: [
    {
      url: API_GATEWAY_URL,
      description: 'URL de las funciones de la API',
    },
  ],
  openapi: '3.0.0',
}
/**
 * Documento OpenAPI generado
 * Contiene toda la información de la API para su documentación
 */
export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument(OPEN_API_CONFIG);
