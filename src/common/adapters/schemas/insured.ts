import { z } from "zod";

const INSURED_ID_PATTERN = /^\d{5}$/;
const INSURED_ID_LENGHT = 5;
export const insuredIdSchema = z.string({
    description: "Código de asegurado",
})
    .length(INSURED_ID_LENGHT, "La longitud debe ser de 5 dígitos")
    .regex(INSURED_ID_PATTERN, "Debe un número de 5 dígitos")