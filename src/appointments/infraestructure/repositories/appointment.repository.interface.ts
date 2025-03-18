import { IAppointment } from "../../domain/interfaces/appointment";
import { IBaseAppointment } from "../../../common/domain/interfaces/base-appointment.interface";

export interface IAppointmentRepository {
  create(appointment: IBaseAppointment): Promise<IAppointment>;

  getAllByEnsuranceId(insuredId: string): Promise<IBaseAppointment[]>;

  updateAppointment(
    item: IAppointment,
  ): Promise<void>;

  getAppointmentDetail(insuredId: string, scheduleId: number): Promise<IAppointment | null | undefined>;
}
