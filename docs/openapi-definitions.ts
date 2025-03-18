import { z } from 'zod';
import { appointmentCreateSchema, appointmentCompleteSchema } from '../adapters/schemas/appointment';
import { registerOperation, registerSchema, registry } from './zod-openapi';

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

// Register API operations
registerOperation({
  method: 'post',
  path: '/appointments',
  summary: 'Create a new appointment',
  description: 'Endpoint to create a new appointment for an insured person',
  tags: ['Appointments'],
  requestSchema: AppointmentCreateSchema,
  responseSchema: AppointmentResponseSchema,
  responseDescription: 'The created appointment',
});

registerOperation({
  method: 'get',
  path: '/insureds/{insuredId}/appointments',
  summary: 'Get appointments by insured ID',
  description: 'Retrieve all appointments for a specific insured person',
  tags: ['Appointments'],
  pathParams: z.object({
    insuredId: z.string({
      description: 'The ID of the insured person',
    }),
  }),
  responseSchema: AppointmentListResponseSchema,
  responseDescription: 'List of appointments for the insured person',
});

// Generate the OpenAPI document
export const openApiDocument = registry.getOpenAPIDocument({
  info: {
    title: 'Appointment Service API',
    version: '1.0.0',
    description: 'API for managing appointments',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
});
