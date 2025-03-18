import { IAppointmentProducer } from "../../infraestructure/messasing/appointment.producer.interface";
import { IAppointmentCountryRepository } from "../../infraestructure/repositories/appointment-country.repository.interface";
import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";
import { AppointmentStatusType } from "../../../common/domain/models/appointment-status";
import { IAppointmentCountryService } from "./appointment-country.service.interface";
import { BaseAppointment } from "../../../common/domain/models/base-appointment.model";

/**
 * Clase abstracta que implementa las operaciones comunes para servicios de citas por país.
 * Esta clase forma parte del patrón Strategy, donde:
 * - AppointmentCountryService actúa como la estrategia abstracta base
 * - AppointmentPEService y AppointmentCLService son las estrategias concretas
 * - IAppointmentCountryService define el contrato de la estrategia
 * 
 * Proporciona funcionalidad base que debe ser extendida por implementaciones específicas de cada país.
 */
export abstract class AppointmentCountryService implements IAppointmentCountryService {
  /**
   * @param appointmentCountryRepository - Repositorio para almacenar citas específicas del país
   * @param appointmentCountryProducer - Productor de mensajes para enviar datos de citas
   */
  constructor(
    private appointmentCountryRepository: IAppointmentCountryRepository,
    private appointmentCountryProducer: IAppointmentProducer
  ) {}
  
  /**
   * Crea una nueva cita en el sistema específico del país.
   * Almacena la cita en el repositorio con estado inicial PENDING y
   * envía los datos al productor de mensajes para ser enviados a otros servicios.
   * @param appointment - Datos de la cita a crear
   */
  async createAppointment(appointment: IAppointmentCreate): Promise<void> {
    await this.appointmentCountryRepository.create(
      BaseAppointment.fromCreate(appointment)
    );
    await this.appointmentCountryProducer.sendAppointmentCountry(appointment);
  }
}
