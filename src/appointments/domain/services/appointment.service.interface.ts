import { IBaseAppointment } from "../../../common/domain/interfaces/appointment";
import { IAppointmentCreate } from "../../../common/domain/interfaces/appointment-create";

export interface IAppointmentService {
  createAppointment(appointment: IAppointmentCreate): Promise<void>;

  getAppointmentsByInsuredId(insuredId: string): Promise<IBaseAppointment[]>;

  completeAppointment(insuredId: string, scheduleId: number): Promise<void>;
}
