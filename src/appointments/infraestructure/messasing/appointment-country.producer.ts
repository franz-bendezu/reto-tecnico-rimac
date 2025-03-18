import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";
import { IAppointmentCountryProducer } from "./appointment-country.producer.interface";
import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";
import { IAppointmentConfig } from "../config/appointment.config.interface";

/**
 * Tipo que define los métodos necesarios del cliente SNS para el productor de citas por país.
 */
export type SNSClientAppointment = Pick<SNSClient, "send">;

/**
 * Implementación del productor de mensajes para citas específicas por país utilizando AWS SNS.
 * Permite publicar información de citas en un topic SNS para su posterior procesamiento.
 */
export class AppointmentCountryProducer implements IAppointmentCountryProducer {
  /**
   * @param snsClient - Cliente de AWS SNS para publicar mensajes
   * @param config - Configuración con el ARN del topic SNS y otros parámetros
   */
  constructor(private snsClient: SNSClientAppointment, private config: IAppointmentConfig) {}
  
  /**
   * Publica los datos de una cita en el topic SNS configurado.
   * Incluye el código ISO del país como atributo del mensaje para facilitar el filtrado.
   * @param appointment - Datos de la cita a publicar
   */
  async sendAppointment(appointment: IAppointmentCreate): Promise<void> {
    const snsConfig = this.config;
    const params: PublishCommandInput = {
      Message: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: appointment.countryISO,
        },
      },
      TopicArn: snsConfig.snsTopicArn,
    };
    await this.snsClient.send(new PublishCommand(params));
  }
}
