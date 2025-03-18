import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

export interface IAppointmentProducer {
  sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void>;
}
