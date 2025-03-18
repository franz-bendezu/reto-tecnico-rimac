import { z } from 'zod';
import { registerSchema, registry } from './zod-openapi';
import { appointmentCreateSchema, appointmentCompleteSchema } from '../common/adapters/schemas/appointment';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

/**
 * Registros de esquemas para la documentación OpenAPI
 * Estos esquemas definen la estructura de los datos utilizados en la API
 */

/**
 * Esquema para la creación de citas
 * Define la estructura de datos requerida para crear una nueva cita
 */
const AppointmentCreateSchema = registerSchema(
  appointmentCreateSchema,
  'AppointmentCreate',
  'Esquema para crear una nueva cita'
);

/**
 * Esquema para completar citas
 * Define la estructura de datos requerida para marcar una cita como completada
 */
const AppointmentCompleteSchema = registerSchema(
  appointmentCompleteSchema,
  'AppointmentComplete',
  'Esquema para completar una cita'
);

/**
 * Esquema de respuesta para citas individuales
 * Define la estructura de los datos devueltos para una cita
 */
const AppointmentResponseSchema = registerSchema(
  z.object({
    insuredId: z.string(),
    scheduleId: z.number(),
    countryISO: z.string(),
    createdAt: z.string().optional(),
  }),
  'AppointmentResponse',
  'Esquema para respuesta de cita'
);

/**
 * Esquema de respuesta para listas de citas
 * Define la estructura de los datos devueltos para múltiples citas
 */
const AppointmentListResponseSchema = registerSchema(
  z.array(AppointmentResponseSchema),
  'AppointmentListResponse',
  'Esquema para respuesta de lista de citas'
);

/**
 * Esquema para respuestas de error
 * Define la estructura de los mensajes de error devueltos por la API
 */
const ErrorResponseSchema = registerSchema(
  z.object({
    message: z.string(),
  }),
  'ErrorResponse',
  'Esquema para respuesta de error'
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
  path: '/appointments',
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
  },
});

/**
 * Endpoint para obtener citas por ID del asegurado
 * Permite consultar todas las citas asociadas a un asegurado específico
 */
registry.registerPath({
  method: 'get',
  path: '/insureds/{insuredId}/appointments',
  summary: 'Obtener citas por ID del asegurado',
  description: 'Recuperar todas las citas para una persona asegurada específica',
  tags: ['Citas'],
  request: {
    params: z.object({
      insuredId: z.string(),
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
    },
  },
});

/**
 * Documento OpenAPI generado
 * Contiene toda la información de la API para su documentación
 */
export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  info: {
    title: 'API de Servicio de Citas',
    version: '1.0.0',
    description: 'API para gestionar citas',
  },
  servers: [
    {
      url: ' https://xxxxx.us-east-1.amazonaws.com/dev',
      description: 'Servidor de desarrollo local',
    },
  ],
  openapi: '3.0.0',
});
