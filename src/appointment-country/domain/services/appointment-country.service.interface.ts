import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

export interface IAppointmentCountryService {
  createAppointment(appointment: IAppointmentCreate): Promise<void>;
}
