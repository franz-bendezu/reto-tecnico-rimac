import {
    CountryISO,
    IAppointmentCreate,
} from "../interfaces/appointment-create";

/**
 * Modelo para la creación de citas médicas.
 * Implementa la interfaz IAppointmentCreate.
 */
export class AppointmentCreate implements IAppointmentCreate {
    /**
     * @param insuredId - Identificador único del asegurado
     * @param scheduleId - Identificador de la programación de la cita
     * @param countryISO - Código ISO del país donde se realizará la cita
     */
    constructor(
        public insuredId: string,
        public scheduleId: number,
        public countryISO: CountryISO
    ) { }
}
