import { IAppointment, IBaseAppointment } from "../../../common/domain/interfaces/appointment";

export interface IAppointmentRepository {
  create(appointment: IBaseAppointment): Promise<void>;

  getAllByEnsuranceId(insuredId: string): Promise<IBaseAppointment[]>;

  updateAppointment(
    item: IAppointment,
  ): Promise<void>;

  getAppointmentDetail(insuredId: string, scheduleId: number): Promise<IAppointment | null | undefined>;
}
