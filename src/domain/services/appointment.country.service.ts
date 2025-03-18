import { IAppointmentProducer } from "../../infraestructure/messasing/appointment.producer.interface";
import { IAppointmentCountryRepository } from "../../infraestructure/repositories/appointment-country.repository.interface";
import { IAppointmentCreate } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "../models/appointment-status";
import { IAppointmentCountryService } from "./appointment-country.service.interface";

export abstract class AppointmentCountryService implements IAppointmentCountryService {
  constructor(
    private appointmentCountryRepository: IAppointmentCountryRepository,
    private appointmentCountryProducer: IAppointmentProducer
  ) {}
  async createAppointment(appointment: IAppointmentCreate): Promise<void> {
    await this.appointmentCountryRepository.create({
      ...appointment,
      lastStatus: AppointmentStatusType.PENDING,
    });
    await this.appointmentCountryProducer.sendAppointmentCountry(appointment);
  }
}
