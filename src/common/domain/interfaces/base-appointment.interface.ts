import { CountryISO } from "./appointment-create";
import { AppointmentStatusTypes } from "./appointment-status";


export interface IBaseAppointment {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  lastStatus: AppointmentStatusTypes;
}
