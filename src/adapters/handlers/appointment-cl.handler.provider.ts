import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { AppointmentCLService } from "../../domain/services/appointment-cl.service";
import { AppointmentCLConfigEnv } from "../../infraestructure/config/appointment-cl-env.config";
import { AppointmentProducer } from "../../infraestructure/messasing/appointment.producer";
import { AppointmentCountryRDSRepository } from "../../infraestructure/repositories/appointment-country-rds.repository";
import { CountryAppointmentController } from "../controllers/appointment-country.controller";

const config = new AppointmentCLConfigEnv();
const appointmentProducer = new AppointmentProducer(
  new EventBridgeClient({}),
  config
);
const appointmentCountryRepository = new AppointmentCountryRDSRepository(
  config
);
export const appointmentService = new AppointmentCLService(
  appointmentCountryRepository,
  appointmentProducer
);
export const appointmentCountryController = new CountryAppointmentController(appointmentService);
