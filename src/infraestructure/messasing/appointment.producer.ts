import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";
import { IAppointmentCountryConfig, IEventBridgeConfig } from "../config/appointment-country.config.interface";
import { IAppointmentProducer } from "./appointment.producer.interface";
import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from "@aws-sdk/client-eventbridge";

export type EventBridgeClientAppointment = Pick<EventBridgeClient, "send">;

export class AppointmentProducer implements IAppointmentProducer {
  constructor(private eventBridgeClient: EventBridgeClientAppointment, private config: IEventBridgeConfig ) {}
  async sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void> {
    const eventBridgeConfig = this.config;
    const params:PutEventsCommandInput = {
      Entries: [
        {
          Detail: JSON.stringify(appointment),
          DetailType: eventBridgeConfig.detailType,
          EventBusName: eventBridgeConfig.busName,
          Source: eventBridgeConfig.source,
        },
      ],
    };
    await this.eventBridgeClient.send(new PutEventsCommand(params));
  }
}
