export type CountryISO = "PE" | "CL";

export interface IAppointmentCreate {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
}
