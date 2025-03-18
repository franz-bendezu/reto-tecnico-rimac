import { AppointmentProducer, EventBridgeClientAppointment } from "../appointment.producer";
import { IAppointmentCreate } from "../../../../common/domain/interfaces/appointment-create";
import { IEventBridgeConfig } from "../../config/appointment-country.config.interface";
import { PutEventsCommand } from "@aws-sdk/client-eventbridge";

describe("AppointmentProducer", () => {
    let appointmentProducer: AppointmentProducer;
    let mockEventBridgeClient: jest.Mocked<EventBridgeClientAppointment>;
    let mockConfig: IEventBridgeConfig;

    beforeEach(() => {
        mockEventBridgeClient = { send: jest.fn() };
        mockConfig = {
            detailType: "testDetailType",
            busName: "testBusName",
            source: "testSource",
        }
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
                    DetailType: mockConfig.detailType,
                    EventBusName: mockConfig.busName,
                    Source: mockConfig.source,
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
        mockEventBridgeClient.send.mockImplementationOnce(() => {
            throw error;
        });

        await expect(
            appointmentProducer.sendAppointmentCountry(appointment)
        ).rejects.toThrow("EventBridge error");
    });
});
