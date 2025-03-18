import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry, openApiDocument } from '../openapi-definitions';

describe('OpenAPI Definitions', () => {
    it('should generate OpenAPI document correctly', () => {
        const document = new OpenApiGeneratorV3(registry.definitions).generateDocument({
            info: {
                title: 'API de Servicio de Citas',
                version: '1.0.0',
                description: 'API para gestionar citas',
            },
            servers: [
                {
                    url: ' https://xxxxx.us-east-1.amazonaws.com/dev',
                    description: 'Servidor de desarrollo local',
                },
            ],
            openapi: '3.0.0',
        });

        expect(document).toEqual(openApiDocument);
    });
});