import { IAppointmentCreate } from "../../common/domain/interfaces/appointment-create";
import { handler } from "../handler-cl";
import { appointmentCountryController } from "../handler-cl.provider";

jest.mock("../handler-cl.provider");

describe("appointment-cl.handler", () => {
    let mockCreateAppointment: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCreateAppointment = jest
            .spyOn(appointmentCountryController, "createAppointment")
            .mockImplementation(jest.fn());
    });

    it("should process all records in the event", async () => {
        const items: IAppointmentCreate[] = [
            { insuredId: "123", scheduleId: 1, countryISO: "CL" },
            { insuredId: "456", scheduleId: 2, countryISO: "CL" },
        ];
        const event = {
            Records: items.map((item) => ({
                body: JSON.stringify({
                    Message: JSON.stringify(item),
                }),
            })),
        };

        await handler(event as any, {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledTimes(2);
        expect(mockCreateAppointment).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: "123",
                scheduleId: 1,
                countryISO: "CL",
            })
        );
        expect(mockCreateAppointment).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: "456",
                scheduleId: 2,
                countryISO: "CL",
            })
        );
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

        await expect(handler(event as any, {} as any, {} as any)).rejects.toThrow();
        expect(mockCreateAppointment).not.toHaveBeenCalled();
    });
});
