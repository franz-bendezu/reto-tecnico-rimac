import { z } from 'zod';
import { registerSchema, registry } from './zod-openapi';
import { appointmentCreateSchema, appointmentCompleteSchema } from '../common/adapters/schemas/appointment';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

// Register schemas for OpenAPI
const AppointmentCreateSchema = registerSchema(
  appointmentCreateSchema,
  'AppointmentCreate',
  'Schema for creating a new appointment'
);

const AppointmentCompleteSchema = registerSchema(
  appointmentCompleteSchema,
  'AppointmentComplete',
  'Schema for completing an appointment'
);

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

const AppointmentListResponseSchema = registerSchema(
  z.array(AppointmentResponseSchema),
  'AppointmentListResponse',
  'Schema for appointment list response'
);

const ErrorResponseSchema = registerSchema(
  z.object({
    message: z.string(),
  }),
  'ErrorResponse',
  'Schema for error response'
);

// Register API operations directly using registry.registerPath
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

// Generate the OpenAPI document
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
