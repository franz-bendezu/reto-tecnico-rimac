import { z } from "zod";
import { COUNTRIES_ISO } from "../../domain/constants/countries";
import { insuredIdSchema } from "./insured";
import { IAppointmentCompleteSchema, IAppointmentCreateSchema } from "../interfaces/appointment.interface";

export const scheduleIdSchema = z.number({
  message: "El id de la cita debe ser un número",
}).nonnegative({
  message: "El id de la cita debe ser un número positivo",
});

export const appointmentCreateSchema: z.Schema<IAppointmentCreateSchema> = z.object({
  insuredId: insuredIdSchema,
  scheduleId: scheduleIdSchema,
  countryISO: z.enum(COUNTRIES_ISO , {
    message: `El país debe ser: ${COUNTRIES_ISO.join(", ")}`,
  })
});

export const appointmentCompleteSchema: z.Schema<IAppointmentCompleteSchema> = z.object({
  insuredId: insuredIdSchema,
  scheduleId: scheduleIdSchema,
});
