import { z } from "zod";
import { COUNTRIES_ISO } from "../../domain/constants/countries";
import { insuredIdSchema } from "./insured";
import { IAppointmentCompleteSchema, IAppointmentCreateSchema } from "../interfaces/appointment.interface";

export const appointmentCreateSchema: z.Schema<IAppointmentCreateSchema> = z.object({
  insuredId: insuredIdSchema,
  scheduleId: z.number(),
  countryISO: z.enum(COUNTRIES_ISO),
});

export const appointmentCompleteSchema: z.Schema<IAppointmentCompleteSchema> = z.object({
  insuredId: insuredIdSchema,
  scheduleId: z.number(),
});
