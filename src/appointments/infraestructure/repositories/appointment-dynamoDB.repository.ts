import { IAppointment, IBaseAppointment } from "../../../common/domain/interfaces/appointment";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "./appointment.repository.interface";
import { IAppointmentConfig } from "../config/appointment.config.interface";

export type AppointmentDynamoClient = Pick<DynamoDBDocumentClient, "send">;

export class AppointmentDynamoDBRepository implements IAppointmentRepository {

  constructor(private docClient: AppointmentDynamoClient, private config: IAppointmentConfig) { }

  async create(appointment: IBaseAppointment): Promise<void> {
    const result: IAppointment = {
      ...appointment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statuses: [
        {
          status: appointment.lastStatus,
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await this.docClient.send(
      new PutCommand({
        TableName: this.config.dynamoDBTableName,
        Item: result,
      })
    );
    return result;
  }

  async getAllByEnsuranceId(insuredId: string): Promise<IAppointment[]> {
    const { Items = [] } = await this.docClient.send(
      new ScanCommand({
        TableName: this.config.dynamoDBTableName,
        FilterExpression: "insuredId = :insuredId",
        ExpressionAttributeValues: {
          ":insuredId": insuredId,
        },
      })
    );

    return Items as IAppointment[];
  }

  async updateAppointment(
    item: IAppointment,
  ): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.config.dynamoDBTableName,
        Item: item,
      })
    );
  }

  public async getAppointmentDetail(insuredId: string, scheduleId: number): Promise<IAppointment | null | undefined> {
    const { Item } = await this.docClient.send(
      new GetCommand({
        TableName: this.config.dynamoDBTableName,
        Key: {
          insuredId,
          scheduleId,
        },
      })
    );
    return Item as IAppointment | null | undefined;
  }
}
