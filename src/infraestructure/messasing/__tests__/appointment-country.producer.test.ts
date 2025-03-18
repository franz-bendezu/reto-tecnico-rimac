import { AppointmentCountryProducer, SNSClientAppointment } from "../appointment-country.producer";
import { IAppointmentCreate } from "../../../domain/interfaces/appointment-create";
import { IAppointmentConfig } from "../../config/appointment.config.interface";
import { PublishCommand } from "@aws-sdk/client-sns";

jest.mock("@aws-sdk/client-sns");

describe("AppointmentCountryProducer", () => {
    let snsClient: jest.Mocked<SNSClientAppointment>;
    let config: IAppointmentConfig;
    let producer: AppointmentCountryProducer;

    beforeEach(() => {
        snsClient = {
            send: jest.fn(),
        };
        config = {
            snsTopicArn: "arn:aws:sns:us-east-1:123456789012:MyTopic",
            dynamoDBTableName: "appointments",
        };
        producer = new AppointmentCountryProducer(snsClient, config);
    });

    it("should send appointment msessage to SNS", async () => {
        const appointment: IAppointmentCreate = {
            insuredId: "2",
            scheduleId: 1,
            countryISO: "PE"
        };
        await producer.sendAppointment(appointment);

        expect(snsClient.send).toHaveBeenCalledWith(expect.any(PublishCommand));
    });

    it("should handle errors when sending appointment message to SNS", async () => {
        const appointment: IAppointmentCreate = {
            insuredId: "122",
            scheduleId: 1,
            countryISO: "PE"
        };

        const error = new Error("SNS send error");
        snsClient.send.mockImplementationOnce(() => {
            throw error;
        });

        await expect(producer.sendAppointment(appointment)).rejects.toThrow("SNS send error");
    });
});