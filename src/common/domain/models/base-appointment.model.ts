import { IBaseAppointment } from "../interfaces/appointment";
import { CountryISO } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "./appointment-status";

/**
 * Modelo base para citas médicas.
 * Implementa la interfaz IBaseAppointment.
 */
export class BaseAppointment implements IBaseAppointment {
    /**
     * @param insuredId - Identificador único del asegurado
     * @param scheduleId - Identificador de la programación de la cita
     * @param countryISO - Código ISO del país donde se realizará la cita
     * @param lastStatus - Estado actual de la cita
     */
    constructor(
        public insuredId: string,
        public scheduleId: number,
        public countryISO: CountryISO,
        public lastStatus: AppointmentStatusType
    ) { }
}
