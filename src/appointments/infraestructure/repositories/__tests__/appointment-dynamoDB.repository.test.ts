import {
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandOutput,
    PutCommand,
    PutCommandOutput,
    ScanCommand,
    ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import {
    AppointmentDynamoClient,
    AppointmentDynamoDBRepository,
} from "../appointment-dynamoDB.repository";
import {
    IAppointment,
    IBaseAppointment,
} from "../../../../common/domain/interfaces/appointment";
import { IAppointmentConfig } from "../../config/appointment.config.interface";

jest.mock("@aws-sdk/lib-dynamodb", () => ({
    DynamoDBClient: jest.fn(),
    GetCommand: jest.fn(),
    PutCommand: jest.fn(),
    ScanCommand: jest.fn(),
}));

describe("AppointmentDynamoDBRepository", () => {
    let docClient: jest.Mocked<AppointmentDynamoClient>;
    let config: IAppointmentConfig;
    let repository: AppointmentDynamoDBRepository;

    beforeEach(() => {
        docClient = {
            send: jest.fn(),
        };
        config = {
            dynamoDBTableName: "appointments",
            snsTopicArn: "arn:aws:sns:us-east-1:123456789012:appointments",
        };
        repository = new AppointmentDynamoDBRepository(docClient, config);
    });

    it("should create a new appointment", async () => {
        const appointment: IBaseAppointment = {
            insuredId: "123",
            scheduleId: 1,
            lastStatus: "pending",
            countryISO: "PE",
        };

        docClient.send.mockImplementationOnce(
            (): PutCommandOutput => ({
                $metadata: {
                    requestId: "123",
                },
            })
        );

        await repository.create(appointment);

        expect(docClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it("should return all appointments for a given insuredId", async () => {
        const insuredId = "123";
        const mockItems: IAppointment[] = [
            {
                insuredId: "123",
                scheduleId: 1,
                lastStatus: "pending",
                statuses: [],
                createdAt: "",
                updatedAt: "",
                countryISO: "",
            },
        ];

        docClient.send.mockImplementationOnce(
            (): ScanCommandOutput => ({
                Items: mockItems,
                $metadata: {
                    requestId: "123",
                },
            })
        );

        const result = await repository.getAllByEnsuranceId(insuredId);

        expect(docClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(result).toEqual(mockItems);
    });

    it("should update the status of an appointment", async () => {
        const insuredId = "123";
        const scheduleId = 1;
        const status = "completed";
        const mockItem = {
            insuredId: "123",
            scheduleId: 1,
            lastStatus: "scheduled",
            statuses: [],
        };

        docClient.send.mockImplementationOnce(
            (): GetCommandOutput => ({
                Item: mockItem,
                $metadata: {
                    requestId: "123",
                },
            })
        );

        docClient.send.mockImplementationOnce(
            (): PutCommandOutput => ({
                $metadata: {
                    requestId: "123",
                },
            })
        );

        await repository.updateAppointment({
            insuredId,
            scheduleId,
            statuses: [
                {
                    status: "pending",
                    createdAt: "",
                },
                {
                    status: "completed",
                    createdAt: "",
                },
            ],
            lastStatus: status,
            createdAt: "",
            updatedAt: "",
            countryISO: "",
        });
        expect(docClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should retrieve an appointment detail successfully', async () => {
        const mockItem: IAppointment = {
            insuredId: "123",
            scheduleId: 1,
            lastStatus: "pending",
            statuses: [{
                status: "pending",
                createdAt: "2023-01-01"
            }],
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            countryISO: "PE"
        };

        docClient.send.mockImplementationOnce(
            (): GetCommandOutput => ({
                Item: mockItem,
                $metadata: {
                    requestId: "123",
                },
            })
        );

        const result = await repository.getAppointmentDetail("123", 1);

        expect(docClient.send).toHaveBeenCalledWith(
            expect.any(GetCommand)
        );
        expect(result).toEqual(mockItem);
    });

    it('should return null when appointment is not found', async () => {
        docClient.send.mockImplementationOnce(
            (): GetCommandOutput => ({
                $metadata: {
                    requestId: "123",
                },
            })
        );

        const result = await repository.getAppointmentDetail("123", 1);

        expect(docClient.send).toHaveBeenCalledWith(
            expect.any(GetCommand) 
        );
        expect(result).toBeUndefined();
    });
});


