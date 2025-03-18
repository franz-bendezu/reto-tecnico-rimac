export const enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500
}

export const enum ResponseMessage {
  INTERNAL_SERVER_ERROR = "Internal server error",
  BAD_REQUEST = "Bad request",
  APPOINTMENT_IN_PROCESS = "El agendamiento está en proceso"
}
