<!--
title: 'API de citas en AWS con NodeJS'
description: 'Este proyecto demuestra cómo crear una API HTTP con Node.js ejecutándose en AWS Lambda y API Gateway utilizando el Framework Serverless.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
-->

# Servicio de Gestión de Citas con Serverless Framework

Este proyecto implementa un servicio de gestión de citas utilizando AWS Lambda, API Gateway, DynamoDB, SNS y SQS mediante el Serverless Framework.

## Prerrequisitos

- Node.js >= 18
- AWS CLI configurado
- Cuenta AWS con permisos necesarios
- Cuenta en [Serverless Framework](https://app.serverless.com)
- Serverless Framework instalado globalmente:
  ```bash
  npm install -g serverless
  ```

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar sesión en Serverless Framework:
   ```bash
   # Método interactivo (recomendado)
   serverless login

   # O usando un token (para CI/CD)
   serverless login --provider=serverless --token=YOUR_SERVERLESS_TOKEN
   ```

3. Verificar la organización en Serverless Framework:
   ```bash
   # Este proyecto está configurado para la organización 'octatec'
   # y la aplicación 'appointment' en Serverless Framework.
   # Puedes verificar tu organización actual con:
   serverless org list
   
   # Para cambiar de organización si es necesario:
   serverless org switch --org octatec
   ```

4. Configurar credenciales de AWS:
   ```bash
   # Método manual
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   
   # O usando AWS CLI (si ya está configurado)
   aws configure
   ```

## Comandos Principales

### Desarrollo Local
Para ejecutar el proyecto localmente:
```bash
npm run local
```
Este comando inicia un emulador de AWS Lambda que te permite probar las funciones localmente.

### Pruebas
Para ejecutar los tests con cobertura:
```bash
npm test
```

### Documentación
Para generar la documentación OpenAPI:
```bash
npm run build:openapi
```

Para ver la documentación en Swagger UI:
```bash
npm run swagger
```
Esto iniciará un servidor en http://localhost:3000 donde podrás explorar la API interactivamente.

### Despliegue
Para desplegar a AWS:
```bash
# Despliegue al entorno por defecto (dev)
npm run deploy

# Despliegue a un entorno específico
serverless deploy --stage production
```

Después del despliegue, deberías ver una salida similar a:

```
Deploying "appointment" to stage "dev" (us-east-1)

✔ Service deployed to stack appointment-dev

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/insureds/{insuredId}/appointments
endpoint: POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/appointments
functions:
  appointment: appointment-dev-appointment (xx kB)
  appointment_pe: appointment-dev-appointment_pe (xx kB)
  appointment_cl: appointment-dev-appointment_cl (xx kB)
```

## Configuración de Serverless Framework

Este proyecto está configurado con:
- **Organización**: octatec
- **Aplicación**: appointment
- **Servicio**: appointment

Estos parámetros están definidos en el archivo `serverless.yml` y se utilizan para gestionar el proyecto en el dashboard de Serverless Framework.

## Documentación de la API

La API expone los siguientes endpoints principales:

- `POST /appointments` - Crear una nueva cita
- `GET /insureds/{insuredId}/appointments` - Obtener citas de un asegurado

Para ver la documentación detallada de los endpoints y cómo consumir la API, puedes utilizar Swagger UI ejecutando `npm run swagger`.

## Arquitectura

Este proyecto utiliza una arquitectura basada en eventos:

1. **API Gateway**: Recibe las solicitudes HTTP y las dirige a las funciones Lambda
2. **Lambda**: Procesa las solicitudes y almacena/recupera datos de DynamoDB
3. **DynamoDB**: Almacena la información de las citas
4. **SNS**: Publica mensajes para procesamiento asíncrono
5. **SQS**: Gestiona colas para procesamiento específico por país (Perú y Chile)
6. **EventBridge**: Coordina eventos del sistema cuando se completan las citas

## Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

```bash
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
```

## Notas Importantes

- Por defecto, los endpoints son públicos. Para producción, se recomienda configurar un autorizador
- Los eventos se procesan a través de SQS para operaciones asíncronas
- El sistema está configurado para manejar diferentes flujos según el país (PE o CL)

Para más detalles sobre la implementación y arquitectura, consulta la documentación del código fuente.
