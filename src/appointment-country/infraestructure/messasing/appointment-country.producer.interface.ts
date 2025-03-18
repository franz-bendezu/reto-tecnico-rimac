import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

/**
 * Interfaz para el productor de mensajes relacionados con las citas por país.
 * Permite la comunicación entre el sistema central y sistemas específicos por país.
 */
export interface IAppointmentCountryProducer {
  /**
   * Envía los datos de una cita médica al sistema de gestión del país correspondiente.
   * @param appointment - Datos de la cita a enviar
   */
  sendAppointment(appointment: IAppointmentCreate): Promise<void>;
}
