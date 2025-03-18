import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

/**
 * Interfaz para el productor de mensajes relacionados con citas por país.
 * Define métodos para enviar información de citas a sistemas externos.
 */
export interface IAppointmentProducer {
  /**
   * Envía información de una cita médica al sistema específico del país.
   * @param appointment - Datos de la cita a enviar
   */
  sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void>;
}
