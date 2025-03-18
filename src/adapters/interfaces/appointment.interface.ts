export interface IAppointmentCreateSchema {
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
}

export interface IAppointmentCompleteSchema {
    insuredId: string;
    scheduleId: number;
}
