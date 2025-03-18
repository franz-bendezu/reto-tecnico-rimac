import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

/**
 * Interfaz para el servicio de gestión de citas específicas por país.
 * Define las operaciones disponibles para el manejo de citas según la localización geográfica.
 */
export interface IAppointmentCountryService {
  /**
   * Crea una nueva cita en el sistema del país específico.
   * @param appointment - Datos de la cita a crear
   */
  createAppointment(appointment: IAppointmentCreate): Promise<void>;
}
