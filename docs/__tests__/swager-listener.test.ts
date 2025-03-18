import http from 'http';
import { createRequestListener } from '../swager-listener';

jest.mock('../swagger', () => ({
    getSwaggerHtml: jest.fn(() => '<html>Swagger UI</html>'),
}));

jest.mock('../openapi-definitions', () => ({
    openApiDocument: { info: { title: 'Test API' } },
}));

describe('HTTP Server', () => {
    let server: http.Server;

    beforeAll(() => {
        server = http.createServer(createRequestListener());
        server.listen(3001);
    });

    afterAll(() => {
        server.close();
    });

    it('should return Swagger HTML on /docs', async () => {
        const response = await fetch('http://localhost:3001');
        const text = await response.text();

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/html');
        expect(text).toContain('Swagger UI');
    });

    it('should return OpenAPI JSON on /docs/openapi.json', async () => {
        const response = await fetch('http://localhost:3001/openapi.json');
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        expect(json).toEqual({ info: { title: 'Test API' } });
    });

    it('should return 404 on unknown routes', async () => {
        const response = await fetch('http://localhost:3001/unknown');

        expect(response.status).toBe(404);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        const json = await response.json();
        expect(json).toEqual({ message: 'Not found' });
    });
});