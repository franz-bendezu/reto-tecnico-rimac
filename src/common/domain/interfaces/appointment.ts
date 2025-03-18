import { CountryISO } from "./appointment-create";
import {
  AppointmentStatusTypes,
  IAppointmentStatus,
} from "./appointment-status";

export interface IBaseAppointment {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  lastStatus: AppointmentStatusTypes;
}

export interface IAppointment extends IBaseAppointment {
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  statuses: IAppointmentStatus[];
}
