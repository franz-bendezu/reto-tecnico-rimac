import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { AppointmentPEService } from "../../domain/services/appointment-pe.service";
import { AppointmentPEConfigEnv } from "../../infraestructure/config/appointment-pe-env.config";
import { AppointmentProducer } from "../../infraestructure/messasing/appointment.producer";
import { AppointmentCountryRDSRepository } from "../../infraestructure/repositories/appointment-country-rds.repository";
import { CountryAppointmentController } from "../controllers/appointment-country.controller";

const config = new AppointmentPEConfigEnv();
const appointmentProducer = new AppointmentProducer(
  new EventBridgeClient({}),
  config
);
const appointmentCountryRepository = new AppointmentCountryRDSRepository(
  config.rdsDatabase
);
export const appointmentService = new AppointmentPEService(
  appointmentCountryRepository,
  appointmentProducer
);
export const appointmentCountryController = new CountryAppointmentController(appointmentService);
