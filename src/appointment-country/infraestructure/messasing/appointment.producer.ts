import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";
import { IAppointmentCountryConfig, IEventBridgeConfig } from "../config/appointment-country.config.interface";
import { IAppointmentProducer } from "./appointment.producer.interface";
import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from "@aws-sdk/client-eventbridge";

/**
 * Tipo que define los métodos necesarios del cliente EventBridge para el productor de citas.
 */
export type EventBridgeClientAppointment = Pick<EventBridgeClient, "send">;

/**
 * Implementación del productor de mensajes para citas que utiliza AWS EventBridge.
 * Permite enviar eventos de citas médicas a otros servicios mediante un bus de eventos.
 */
export class AppointmentProducer implements IAppointmentProducer {
  /**
   * @param eventBridgeClient - Cliente de AWS EventBridge para enviar eventos
   * @param config - Configuración del EventBridge que incluye nombres de buses y tipos de eventos
   */
  constructor(private eventBridgeClient: EventBridgeClientAppointment, private config: IEventBridgeConfig ) {}
  
  /**
   * Envía los datos de una cita al sistema del país correspondiente mediante EventBridge.
   * Formatea los datos como un evento con la estructura requerida por EventBridge.
   * @param appointment - Datos de la cita a enviar
   */
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
