// node http server withoout express    
import http from 'http';
import { getSwaggerHtml } from './swagger';
import { openApiDocument } from './openapi-definitions';

const server = http.createServer(createRequestListener());

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

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
    };
}
// node http server with express