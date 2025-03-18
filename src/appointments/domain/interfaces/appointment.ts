import {
  IAppointmentStatus,
} from "../../../common/domain/interfaces/appointment-status";
import { IBaseAppointment } from "../../../common/domain/interfaces/base-appointment.interface";

export interface IAppointment extends IBaseAppointment {
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  statuses: IAppointmentStatus[];
}
