import { AppointmentProducer } from "../appointment.producer";
import { IAppointmentCreate } from "../../../domain/interfaces/appointment-create";
import { IAppointmentCountryConfig } from "../../config/appointment-country.config.interface";
import { PutEventsCommand } from "@aws-sdk/client-eventbridge";

describe("AppointmentProducer", () => {
    let appointmentProducer: AppointmentProducer;
    let mockEventBridgeClient: { send: jest.Mock };
    let mockConfig: IAppointmentCountryConfig;

    beforeEach(() => {
        mockEventBridgeClient = { send: jest.fn() };
        mockConfig = {
            eventBridge: {
                detailType: "testDetailType",
                busName: "testBusName",
                source: "testSource",
            },
            awsRegion: "us-east-1",
            rdsDatabase: {
                proxyHostName: "",
                port: 0,
                dbName: "",
                dbUserName: "",
                awsRegion: "",
            },
        };
        appointmentProducer = new AppointmentProducer(
            mockEventBridgeClient,
            mockConfig
        );
    });

    it("should send appointment to EventBridge with correct parameters", async () => {
        const appointment: IAppointmentCreate = {
            insuredId: "",
            scheduleId: 0,
            countryISO: "PE",
        };
        const expectedParams = {
            Entries: [
                {
                    Detail: JSON.stringify(appointment),
                    DetailType: mockConfig.eventBridge.detailType,
                    EventBusName: mockConfig.eventBridge.busName,
                    Source: mockConfig.eventBridge.source,
                },
            ],
        };

        await appointmentProducer.sendAppointmentCountry(appointment);

        expect(mockEventBridgeClient.send).toHaveBeenCalledWith(
            expect.any(PutEventsCommand)
        );
    });

    it("should handle errors when sending appointment to EventBridge", async () => {
        const appointment: IAppointmentCreate = {
            insuredId: "",
            scheduleId: 0,
            countryISO: "PE",
        };
        const error = new Error("EventBridge error");
        mockEventBridgeClient.send.mockRejectedValueOnce(error);

        await expect(
            appointmentProducer.sendAppointmentCountry(appointment)
        ).rejects.toThrow("EventBridge error");
    });
});
