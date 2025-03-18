import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SNSClient } from "@aws-sdk/client-sns";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AppointmentService } from "../../domain/services/appointment.service";
import { AppointmentConfigEnv } from "../../infraestructure/config/appointment-env.config";
import { AppointmentCountryProducer } from "../../infraestructure/messasing/appointment-country.producer";
import { AppointmentDynamoDBRepository } from "../../infraestructure/repositories/appointment-dynamoDB.repository";
import { AppointmentController } from "../controllers/appointment.controller";

const config = new AppointmentConfigEnv();
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const appointmentRepository = new AppointmentDynamoDBRepository(
  docClient,
  config
);
const snsClient = new SNSClient({});
const appointmentCountryProducer = new AppointmentCountryProducer(
  snsClient,
  config
);
export const appointmentService = new AppointmentService(
  appointmentRepository,
  appointmentCountryProducer
);
export const appointmentController = new AppointmentController(appointmentService);
