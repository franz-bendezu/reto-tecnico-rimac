import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry, openApiDocument, OPEN_API_CONFIG } from '../openapi-definitions';

describe('OpenAPI Definitions', () => {
    it('should generate OpenAPI document correctly', () => {
        const document = new OpenApiGeneratorV3(registry.definitions).generateDocument(OPEN_API_CONFIG);

        expect(document).toEqual(openApiDocument);
    });
});