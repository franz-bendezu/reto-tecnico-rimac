import { IAppointmentCreate } from "../interfaces/appointment-create";

export interface IAppointmentCountryService {
  createAppointment(appointment: IAppointmentCreate): Promise<void>;
}
