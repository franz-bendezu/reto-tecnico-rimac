import { IAppointment, IBaseAppointment } from "../../../common/domain/interfaces/appointment";
import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

/**
 * Interfaz que define los servicios disponibles para la gestión de citas médicas.
 */
export interface IAppointmentService {
  /**
   * Crea una nueva cita médica en el sistema.
   * @param appointment - Datos de la cita a crear
   */
  createAppointment(appointment: IAppointmentCreate): Promise<IAppointment>;

  /**
   * Obtiene todas las citas asociadas a un asegurado por su identificador.
   * @param insuredId - Identificador único del asegurado
   * @returns Lista de citas del asegurado
   */
  getAppointmentsByInsuredId(insuredId: string): Promise<IBaseAppointment[]>;

  /**
   * Marca una cita como completada.
   * @param insuredId - Identificador del asegurado
   * @param scheduleId - Identificador de la programación de la cita
   */
  completeAppointment(insuredId: string, scheduleId: number): Promise<void>;
}
