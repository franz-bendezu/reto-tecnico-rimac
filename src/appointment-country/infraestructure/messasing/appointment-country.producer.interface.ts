import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

export interface IAppointmentCountryProducer {
  sendAppointment(appointment: IAppointmentCreate): Promise<void>;
}
