
export const CREATE_APPOINTMENT_PATH = "/appointments";
export const CREATE_APPOINTMENT_ROUTE = `POST ${CREATE_APPOINTMENT_PATH}`;
export const INSURED_ID_PARAM = "insuredId";
export const INSURED_APPOINTMENT_LIST_PATH = `/insureds/{${INSURED_ID_PARAM}}/appointments`;
export const GET_INSURED_APPOINTMENT_LIST_ROUTE = `GET ${INSURED_APPOINTMENT_LIST_PATH}`;

