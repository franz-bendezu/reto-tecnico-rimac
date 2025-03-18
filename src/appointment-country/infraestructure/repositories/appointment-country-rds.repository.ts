import { IBaseAppointment } from "../../../common/domain/interfaces/appointment";
import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";
import type { Connection } from "mysql2/promise";
import { IAppointmentCountryRepository } from "./appointment-country.repository.interface";
import { IDatabaseConfig } from "../config/appointment-country.config.interface";
import { INSERT_APPOINTMENT_QUERY } from "./querys/appointment-country.query";

// RDS settings
export class AppointmentCountryRDSRepository
  implements IAppointmentCountryRepository {
  token?: string;
  constructor(private databaseConfig: IDatabaseConfig) { }

  /**
   * Crea un token de autorización para la base de datos RDS.
   * @returns Token de autorización
   */
  async createAuthToken(): Promise<string> {
    // Create RDS Signer object
    const dbConfig = this.databaseConfig;
    const signer = new Signer({
      hostname: dbConfig.proxyHostName,
      port: dbConfig.port,
      region: dbConfig.awsRegion,
      username: dbConfig.dbUserName,
    });

    // Request authorization token from RDS, specifying the username
    const token = await signer.getAuthToken();
    return token;
  }


  /**
   * Realiza las operaciones de conexión a la base de datos.
   * @returns Conexión a la base de datos
   */
  async dbOps(): Promise<Connection> {
    // Obtain auth token
    const dbConfig = this.databaseConfig;
    if (!this.token) {
      this.token = await this.createAuthToken();
    }

    const conn = await mysql.createConnection({
      host: dbConfig.proxyHostName,
      user: dbConfig.dbUserName,
      password: this.token,
      database: dbConfig.dbName,
      ssl: "Amazon RDS", // Ensure you have the CA bundle for SSL connection
    });
    return conn;
  }

  /**
   * Guarda una nueva cita en la base de datos.
   * @param appointment - Datos de la cita a crear
   */
  async create(appointment: IBaseAppointment): Promise<void> {
    const conn = await this.dbOps();
    const sql = INSERT_APPOINTMENT_QUERY;
    const values = [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.lastStatus,
    ];
    await conn.execute(sql, values);

    await conn.commit();
    await conn.end();
  }
}
