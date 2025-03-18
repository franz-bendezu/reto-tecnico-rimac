import { SQSHandler } from "aws-lambda";
import { handler } from "../handler-pe";
import { appointmentCountryController } from "../handler-pe.provider";

jest.mock("../handler-pe.provider");

describe("appointment-pe.handler", () => {
    const mockCreateAppointment = jest.fn();
    appointmentCountryController.createAppointment = mockCreateAppointment;

    const mockEvent = {
        Records: [
            {
                body: JSON.stringify({ id: 1, name: "Test Appointment" }),
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call createAppointment with the correct appointment data", async () => {
        await handler(mockEvent as any, {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledWith({ id: 1, name: "Test Appointment" });
        expect(mockCreateAppointment).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple records", async () => {
        const multipleRecordsEvent = {
            Records: [
                { body: JSON.stringify({ id: 1, name: "Test Appointment 1" }) },
                { body: JSON.stringify({ id: 2, name: "Test Appointment 2" }) },
            ],
        };

        await handler(multipleRecordsEvent as any,  {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledWith({ id: 1, name: "Test Appointment 1" });
        expect(mockCreateAppointment).toHaveBeenCalledWith({ id: 2, name: "Test Appointment 2" });
        expect(mockCreateAppointment).toHaveBeenCalledTimes(2);
    });
});