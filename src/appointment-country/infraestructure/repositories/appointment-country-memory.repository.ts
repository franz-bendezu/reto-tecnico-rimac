import { IBaseAppointment } from "../../../common/domain/interfaces/base-appointment.interface";
import { IAppointmentCountryRepository } from "./appointment-country.repository.interface";

/**
 * Implementación en memoria del repositorio de citas para pruebas locales.
 * Esta implementación almacena las citas en un array en memoria.
 */
export class AppointmentCountryMemoryRepository
  implements IAppointmentCountryRepository {
  
  // Almacén en memoria para las citas
  private appointments: IBaseAppointment[] = [];

  /**
   * Guarda una nueva cita en el almacén en memoria.
   * @param appointment - Datos de la cita a crear
   */
  async create(appointment: IBaseAppointment): Promise<void> {
    // Crea una copia para evitar referencias mutables
    const newAppointment = { ...appointment };
    
    this.appointments.push(newAppointment);
  }

  /**
   * Obtiene todas las citas de un asegurado específico.
   * @param insuredId - ID del asegurado
   * @returns Lista de citas del asegurado
   */
  async getByInsuredId(insuredId: string): Promise<IBaseAppointment[]> {
    return this.appointments.filter(
      (appointment) => appointment.insuredId === insuredId
    );
  }

  /**
   * Limpia todas las citas almacenadas (útil entre pruebas).
   */
  clear(): void {
    this.appointments = [];
  }

  /**
   * Obtiene todas las citas almacenadas.
   * @returns Lista de todas las citas
   */
  getAll(): IBaseAppointment[] {
    return [...this.appointments];
  }
}
