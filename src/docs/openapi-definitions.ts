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
  'Schema for creating a new appointment'
);

/**
 * Esquema para completar citas
 * Define la estructura de datos requerida para marcar una cita como completada
 */
const AppointmentCompleteSchema = registerSchema(
  appointmentCompleteSchema,
  'AppointmentComplete',
  'Schema for completing an appointment'
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
  'Schema for appointment response'
);

/**
 * Esquema de respuesta para listas de citas
 * Define la estructura de los datos devueltos para múltiples citas
 */
const AppointmentListResponseSchema = registerSchema(
  z.array(AppointmentResponseSchema),
  'AppointmentListResponse',
  'Schema for appointment list response'
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
  'Schema for error response'
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
  summary: 'Create a new appointment',
  description: 'Endpoint to create a new appointment for an insured person',
  tags: ['Appointments'],
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
      description: 'The created appointment',
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
  summary: 'Get appointments by insured ID',
  description: 'Retrieve all appointments for a specific insured person',
  tags: ['Appointments'],
  request: {
    params: z.object({
      insuredId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'List of appointments for the insured person',
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
    title: 'Appointment Service API',
    version: '1.0.0',
    description: 'API for managing appointments',
  },
  servers: [
    {
      url: ' https://bbpveee6vb.execute-api.us-east-1.amazonaws.com/dev',
      description: 'Local development server',
    },
  ],
  openapi: '3.0.0',
});
