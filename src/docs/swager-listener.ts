import http from 'http';
import { openApiDocument } from './openapi-definitions';
import { getSwaggerHtml } from './swagger';


export function createRequestListener(): http.RequestListener<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined {
    return (req, res) => {
        const { pathname } = new URL(req.url || '', 'http://localhost');

        if (pathname === '/docs') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(getSwaggerHtml());
        } else if (pathname === '/docs/openapi.json') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(openApiDocument));
        }
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Not found' }));
        }

        res.end();
    };
}
