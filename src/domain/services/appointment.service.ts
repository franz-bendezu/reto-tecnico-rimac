import { IAppointmentCountryProducer } from "../../infraestructure/messasing/appointment-country.producer.interface";
import { IAppointmentRepository } from "../../infraestructure/repositories/appointment.repository.interface";
import { IBaseAppointment } from "../interfaces/appointment";
import { IAppointmentCreate } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "../models/appointment-status";
import { IAppointmentService } from "./appointment.service.interface";

export class AppointmentService implements IAppointmentService {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private appointmentCountryProducer: IAppointmentCountryProducer
  ) {}

  async createAppointment(newAppointment: IAppointmentCreate): Promise<void> {
    const appointment: IBaseAppointment = {
      insuredId: newAppointment.insuredId,
      scheduleId: newAppointment.scheduleId,
      countryISO: newAppointment.countryISO,
      lastStatus: AppointmentStatusType.PENDING,
    };
    await this.appointmentRepository.create(appointment);
    await this.appointmentCountryProducer.sendAppointment(newAppointment);
  }

  async getAppointmentsByInsuredId(
    insuredId: string
  ): Promise<IBaseAppointment[]> {
    return this.appointmentRepository.getAllByEnsuranceId(insuredId);
  }

  async completeAppointment(
    insuredId: string,
    scheduleId: number
  ): Promise<void> {
    await this.appointmentRepository.updateStatusById(
      insuredId,
      scheduleId,
      AppointmentStatusType.COMPLETED
    );
  }
}
