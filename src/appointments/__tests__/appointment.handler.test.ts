import { handler, CREATE_APPOINTMENT_ROUTE, GET_INSURED_APPOINTMENT_LIST_ROUTE } from "../handler";
import { APIGatewayProxyEventV2, SQSEvent } from "aws-lambda";
import { appointmentController } from "../handler.provider";

jest.mock("../handler.provider");

describe("appointment.handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle SQS event and complete appointment", async () => {
        const sqsEvent: SQSEvent = {
            Records: [
                {
                    body: JSON.stringify({ appointmentId: "123" }),
                    messageId: "",
                    receiptHandle: "",
                    attributes: {
                        ApproximateReceiveCount: "",
                        SentTimestamp: "",
                        SenderId: "",
                        ApproximateFirstReceiveTimestamp: ""
                    },
                    messageAttributes: {},
                    md5OfBody: "",
                    eventSource: "",
                    eventSourceARN: "",
                    awsRegion: ""
                },
            ],
        };

        await handler(sqsEvent);

        expect(appointmentController.completeAppointment).toHaveBeenCalledWith({ appointmentId: "123" });
    });

    it("should handle API Gateway event for creating appointment", async () => {
        const apiEvent: APIGatewayProxyEventV2 = {
            routeKey: CREATE_APPOINTMENT_ROUTE,
            body: JSON.stringify({ name: "Test Appointment" }),
            version: "",
            rawPath: "",
            rawQueryString: "",
            headers: {},
            requestContext: {
                accountId: "",
                apiId: "",
                domainName: "",
                domainPrefix: "",
                http: {
                    method: "",
                    path: "",
                    protocol: "",
                    sourceIp: "",
                    userAgent: ""
                },
                requestId: "",
                routeKey: "",
                stage: "",
                time: "",
                timeEpoch: 0
            },
            isBase64Encoded: false
        };

        (appointmentController.createAppointment as jest.Mock).mockResolvedValue({
            statusCode: 201,
            body: { message: "Appointment created" },
        });

        const result = await handler(apiEvent);

        expect(appointmentController.createAppointment).toHaveBeenCalledWith({ name: "Test Appointment" });
        expect(result).toEqual({
            statusCode: 201,
            body: JSON.stringify({ message: "Appointment created" }),
        });
    });

    it("should handle API Gateway event for getting appointments by insured ID", async () => {
        const apiEvent: APIGatewayProxyEventV2 = {
            routeKey: GET_INSURED_APPOINTMENT_LIST_ROUTE,
            pathParameters: { ensuredId: "456" },
            version: "",
            rawPath: "",
            rawQueryString: "",
            headers: {},
            requestContext: {
                accountId: "",
                apiId: "",
                domainName: "",
                domainPrefix: "",
                http: {
                    method: "",
                    path: "",
                    protocol: "",
                    sourceIp: "",
                    userAgent: ""
                },
                requestId: "",
                routeKey: "",
                stage: "",
                time: "",
                timeEpoch: 0
            },
            isBase64Encoded: false
        };

        (appointmentController.getAppointmentsByInsuredId as jest.Mock).mockResolvedValue({
            statusCode: 200,
            body: { appointments: [] },
        });

        const result = await handler(apiEvent);

        expect(appointmentController.getAppointmentsByInsuredId).toHaveBeenCalledWith("456");
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ appointments: [] }),
        });
    });

    it("should return 400 for unknown route", async () => {
        const apiEvent: APIGatewayProxyEventV2 = {
            routeKey: "UNKNOWN_ROUTE",
            version: "",
            rawPath: "",
            rawQueryString: "",
            headers: {},
            requestContext: {
                accountId: "",
                apiId: "",
                domainName: "",
                domainPrefix: "",
                http: {
                    method: "",
                    path: "",
                    protocol: "",
                    sourceIp: "",
                    userAgent: ""
                },
                requestId: "",
                routeKey: "",
                stage: "",
                time: "",
                timeEpoch: 0
            },
            isBase64Encoded: false
        } ;

        const result = await handler(apiEvent);

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: "Bad request" }),
        });
    });
});