import { handler } from '../handler';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

describe('handler', () => {
    it('should return Swagger UI HTML for /docs path', async () => {
        const event: APIGatewayProxyEventV2 = {
            rawPath: '/docs',
            version: '',
            routeKey: '',
            rawQueryString: '',
            headers: {},
            requestContext: {
                accountId: '',
                apiId: '',
                domainName: '',
                domainPrefix: '',
                http: {
                    method: '',
                    path: '',
                    protocol: '',
                    sourceIp: '',
                    userAgent: ''
                },
                requestId: '',
                routeKey: '',
                stage: '',
                time: '',
                timeEpoch: 0
            },
            isBase64Encoded: false
        } ;

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: expect.stringContaining('Swagger UI'),
        });
    });

    it('should return OpenAPI JSON for /docs/openapi.json path', async () => {
        const event: APIGatewayProxyEventV2 = {
            rawPath: '/docs/openapi.json',
        } as any;

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: expect.stringContaining('openapi'),
        });
    });

    it('should return 404 for unknown paths', async () => {
        const event: APIGatewayProxyEventV2 = {
            rawPath: '/unknown',
        } as any;

        const result = await handler(event);
        expect(result).toEqual({
            statusCode: 404,
            body: JSON.stringify({ message: 'Not found' }),

        });
    });
});