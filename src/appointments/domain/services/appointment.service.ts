import { IAppointmentCountryProducer } from "../../infraestructure/messasing/appointment-country.producer.interface";
import { IAppointmentRepository } from "../../infraestructure/repositories/appointment.repository.interface";
import { IAppointment, IBaseAppointment } from "../../../common/domain/interfaces/appointment";
import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";
import { AppointmentStatusType } from "../../../common/domain/models/appointment-status";
import { BaseAppointment } from "../../../common/domain/models/base-appointment.model";
import { IAppointmentService } from "./appointment.service.interface";
import { Appointment } from "../../../common/domain/models/appointment.model";

/**
 * Implementación principal del servicio de citas médicas.
 * Gestiona el ciclo de vida completo de las citas, desde la creación hasta la finalización.
 */
export class AppointmentService implements IAppointmentService {
  /**
   * @param appointmentRepository - Repositorio para almacenar y recuperar citas
   * @param appointmentCountryProducer - Productor de mensajes para enviar citas a sistemas por país
   */
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private appointmentCountryProducer: IAppointmentCountryProducer
  ) { }

  /**
   * Crea una nueva cita médica en el sistema.
   * Almacena la cita en el repositorio central con estado PENDING y 
   * envía la información al sistema específico del país correspondiente.
   * @param newAppointment - Datos de la nueva cita a crear
   */
  async createAppointment(newAppointment: IAppointmentCreate): Promise<IAppointment> {
    const result = await this.appointmentRepository.create(new BaseAppointment(
      newAppointment.insuredId,
      newAppointment.scheduleId,
      newAppointment.countryISO,
      AppointmentStatusType.PENDING
    ));
    await this.appointmentCountryProducer.sendAppointment(newAppointment);

    return result;
  }

  /**
   * Obtiene todas las citas asociadas a un asegurado específico.
   * @param insuredId - Identificador único del asegurado
   * @returns Lista de citas del asegurado ordenadas cronológicamente
   */
  async getAppointmentsByInsuredId(
    insuredId: string
  ): Promise<IBaseAppointment[]> {
    return this.appointmentRepository.getAllByEnsuranceId(insuredId);
  }

  /**
   * Marca una cita específica como completada.
   * Actualiza el estado de la cita y registra el historial de estados.
   * @param insuredId - Identificador del asegurado
   * @param scheduleId - Identificador de la programación de la cita
   * @throws Error si la cita no se encuentra en el sistema
   */
  async completeAppointment(
    insuredId: string,
    scheduleId: number
  ): Promise<void> {
    const item = await this.appointmentRepository.getAppointmentDetail(insuredId, scheduleId);
    if (!item) {
      throw new Error("Appointment not found");
    }
    const existingStatuses = item.statuses;
    const status = AppointmentStatusType.COMPLETED;
    await this.appointmentRepository.updateAppointment(
      Appointment.from({
        ...item,
        lastStatus: status,
        updatedAt: new Date().toISOString(),
        statuses: [
          ...existingStatuses,
          {
            status,
            createdAt: new Date().toISOString(),
          },
        ],
      }
      ));
  }
}
