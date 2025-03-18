# API de Gestión de Citas Médicas

## Descripción General
Esta API permite gestionar citas médicas para asegurados en diferentes países. Permite crear nuevas citas y consultar el historial de citas por asegurado.

## Base URLs
```
https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

## Endpoints Disponibles

### 1. Crear Nueva Cita
**Endpoint:** `/appointments`
**Método:** POST

#### Cuerpo de la Petición
```json
{
    "insuredId": "12345",     // ID del asegurado (5 caracteres)
    "scheduleId": 123,        // ID del horario
    "countryISO": "PE"        // Código ISO del país (PE o CL)
}
```

#### Respuesta Exitosa
```json
{
    "id": "uuid-123",
    "insuredId": "12345",
    "scheduleId": 123,
    "countryISO": "PE",
    "lasStatus": "pending",
    "createdAt": "2024-03-18T10:00:00Z"
}
```

### 2. Consultar Citas por Asegurado
**Endpoint:** `/insureds/{insuredId}/appointments`
**Método:** GET

#### Parámetros
- `insuredId`: ID del asegurado (5 caracteres)

#### Respuesta Exitosa
```json
{
    "appointments": [
        {
            "id": "uuid-123",
            "insuredId": "12345",
            "scheduleId": 123,
            "countryISO": "PE",
            "status": "pending",
            "createdAt": "2024-03-18T10:00:00Z"
        }
    ]
}
```

## Códigos de Estado

- 200: Operación exitosa
- 201: Cita creada exitosamente
- 400: Error en la solicitud
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Manejo de Errores
Las respuestas de error incluirán:
```json
{
    "statusCode": 400,
    "message": "Descripción del error"
}
```

## Restricciones
- El ID del asegurado debe tener exactamente 5 caracteres
- Los países permitidos son Perú (PE) y Chile (CL)
- Los horarios disponibles deben existir en el sistema

## Ejemplos de Uso

### Crear una Cita (cURL)
```bash
curl -X POST \
  https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/appointments \
  -H 'Content-Type: application/json' \
  -d '{
    "insuredId": "12345",
    "scheduleId": 123,
    "countryISO": "PE"
}'
```

### Consultar Citas de un Asegurado (cURL)
```bash
curl -X GET \
  https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/insureds/12345/appointments
```