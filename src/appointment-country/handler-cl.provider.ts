import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { AppointmentCLService } from "./domain/services/appointment-cl.service";
import { AppointmentCLConfigEnv } from "./infraestructure/config/appointment-cl-env.config";
import { AppointmentProducer } from "./infraestructure/messasing/appointment.producer";
import { AppointmentCountryRDSRepository } from "./infraestructure/repositories/appointment-country-rds.repository";
import { CountryAppointmentController } from "./adapters/controllers/appointment-country.controller";
import { AppointmentCountryMemoryRepository } from "./infraestructure/repositories/appointment-country-memory.repository";

// Aquí se usa el patrón de diseño `Inyección de Dependencias` 
// para proveer los servicios necesarios para el controlador de citas en Chile

const config = new AppointmentCLConfigEnv();
const appointmentProducer = new AppointmentProducer(
  new EventBridgeClient({}),
  config.eventBridge
);
const appointmentCountryRepository =
  new AppointmentCountryRDSRepository(
    config.rdsDatabase
  );
export const appointmentService = new AppointmentCLService(
  appointmentCountryRepository,
  appointmentProducer
);
export const appointmentCountryController = new CountryAppointmentController(appointmentService);
