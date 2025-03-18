import { IAppointment } from "../interfaces/appointment";
import {
    CountryISO,
} from "../interfaces/appointment-create";
import { AppointmentStatusTypes, IAppointmentStatus } from "../interfaces/appointment-status";

/**
 * Modelo para la creación de citas médicas.
 * Implementa la interfaz IAppointmentCreate.
 */
export class Appointment implements IAppointment {
    /**
     * @param insuredId - Identificador único del asegurado
     * @param scheduleId - Identificador de la programación de la cita
     * @param countryISO - Código ISO del país donde se realizará la cita
     */
    constructor(
        public insuredId: string,
        public scheduleId: number,
        public countryISO: CountryISO,
        public lastStatus: AppointmentStatusTypes,
        public createdAt: string,
        public updatedAt: string,
        public statuses: IAppointmentStatus[]
    ) { }


    static from(data: IAppointment): Appointment {
        return new Appointment(
            data.insuredId,
            data.scheduleId,
            data.countryISO,
            data.lastStatus,
            data.createdAt,
            data.updatedAt,
            data.statuses
        );
    }
}
