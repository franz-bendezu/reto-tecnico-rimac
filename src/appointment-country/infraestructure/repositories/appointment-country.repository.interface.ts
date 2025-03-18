import { IBaseAppointment } from "../../../common/domain/interfaces/appointment";

export interface IAppointmentCountryRepository {
  create(appointment: IBaseAppointment): Promise<void>;
}
