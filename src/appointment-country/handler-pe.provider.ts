import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { AppointmentPEService } from "./domain/services/appointment-pe.service";
import { AppointmentPEConfigEnv } from "./infraestructure/config/appointment-pe-env.config";
import { AppointmentProducer } from "./infraestructure/messasing/appointment.producer";
import { AppointmentCountryRDSRepository } from "./infraestructure/repositories/appointment-country-rds.repository";
import { CountryAppointmentController } from "./adapters/controllers/appointment-country.controller";

// Aquí se usa el patrón de diseño `Inyección de Dependencias` 
// para proveer los servicios necesarios para el controlador de citas en Perú

const config = new AppointmentPEConfigEnv();
const appointmentProducer = new AppointmentProducer(
  new EventBridgeClient({}),
  config.eventBridge
);
const appointmentCountryRepository = new AppointmentCountryRDSRepository(
  config.rdsDatabase
);
export const appointmentService = new AppointmentPEService(
  appointmentCountryRepository,
  appointmentProducer
);
export const appointmentCountryController = new CountryAppointmentController(appointmentService);
