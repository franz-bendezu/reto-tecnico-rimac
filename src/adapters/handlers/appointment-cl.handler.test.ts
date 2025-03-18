import { SQSHandler } from "aws-lambda";
import { handler } from "./appointment-cl.handler";
import { appointmentCountryController } from "./appointment-cl.handler.provider";

jest.mock("./appointment-cl.handler.provider");

describe("appointment-cl.handler", () => {
    const mockCreateAppointment = jest.fn();

    beforeAll(() => {
        process.env.AWS_REGION = "us-east-1";
        process.env.APPOINTMENT_COUNTRY_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/123456789012/appointment-country-queue";
        process.env.APPOINTMENT_COUNTRY_QUEUE_NAME = "appointment-country-queue";
        (appointmentCountryController.createAppointment as jest.Mock) = mockCreateAppointment;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should process all records in the event", async () => {
        const event = {
            Records: [
                { body: JSON.stringify({ id: 1, name: "Appointment 1" }) },
                { body: JSON.stringify({ id: 2, name: "Appointment 2" }) },
            ],
        };

        await handler(event as any, {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledTimes(2);
        expect(mockCreateAppointment).toHaveBeenCalledWith({ id: 1, name: "Appointment 1" });
        expect(mockCreateAppointment).toHaveBeenCalledWith({ id: 2, name: "Appointment 2" });
    });

    it("should handle empty event records", async () => {
        const event = { Records: [] };

        await handler(event as any, {} as any, {} as any);

        expect(mockCreateAppointment).not.toHaveBeenCalled();
    });

    it("should handle invalid JSON in event record body", async () => {
        const event = {
            Records: [{ body: "invalid JSON" }],
        };

        await expect(handler(event as any, {} as any, {} as any)).rejects.toThrow(
            "Unexpected token i in JSON at position 0"
        );
        expect(mockCreateAppointment).not.toHaveBeenCalled();
    });
});