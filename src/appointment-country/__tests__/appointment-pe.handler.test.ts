import { SQSHandler } from "aws-lambda";
import { handler } from "../handler-pe";
import { appointmentCountryController } from "../handler-pe.provider";
import { IAppointmentCreate } from "../../common/domain/interfaces/appointment-create";

jest.mock("../handler-pe.provider");

describe("appointment-pe.handler", () => {
    let mockCreateAppointment: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCreateAppointment = jest.spyOn(appointmentCountryController, "createAppointment");
    });

    it("should call createAppointment with the correct appointment data", async () => {
        const item: IAppointmentCreate = {
            insuredId: "123",
            scheduleId: 1,
            countryISO: "PE"
        };
        const mockEvent = {
            Records: [
                {
                    body: JSON.stringify({
                        Message: JSON.stringify(item),
                    }),
                },
            ],
        };

        await handler(mockEvent as any, {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: "123",
                scheduleId: 1,
                countryISO: "PE",
            })
        );
        expect(mockCreateAppointment).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple records", async () => {
        const items: IAppointmentCreate[] = [
            { insuredId: "123", scheduleId: 1, countryISO: "PE" },
            { insuredId: "456", scheduleId: 2, countryISO: "PE" },
        ];
        const multipleRecordsEvent = {
            Records: items.map((item) => ({
                body: JSON.stringify({
                    Message: JSON.stringify(item),
                }),
            })),
        };

        await handler(multipleRecordsEvent as any, {} as any, {} as any);

        expect(mockCreateAppointment).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: "123",
                scheduleId: 1,
                countryISO: "PE",
            })
        );
        expect(mockCreateAppointment).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: "456",
                scheduleId: 2,
                countryISO: "PE",
            })
        );
        expect(mockCreateAppointment).toHaveBeenCalledTimes(2);
    });

    it("should handle invalid JSON in event record body", async () => {
        const event = {
            Records: [{ body: "invalid JSON" }],
        };

        await expect(handler(event as any, {} as any, {} as any)).resolves.toBeUndefined();
        expect(mockCreateAppointment).not.toHaveBeenCalled();
    });
});