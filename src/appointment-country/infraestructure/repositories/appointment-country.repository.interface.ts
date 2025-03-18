import { IBaseAppointment } from "../../../common/domain/interfaces/appointment";

/**
 * Repositorio de citas por país.
 */
export interface IAppointmentCountryRepository {
  /**
   * Crea una nueva cita en el sistema del país específico.
   * @param appointment - Datos de la cita a crear
   */
  create(appointment: IBaseAppointment): Promise<void>;
}
