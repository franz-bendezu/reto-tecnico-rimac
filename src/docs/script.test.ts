import fs from 'fs';
import { openApiDocument } from './openapi-definitions';
import './script';

jest.mock('fs', () => ({
    writeFileSync: jest.fn(),
}));
jest.mock('path', () => ({
    join: jest.fn(
        () => '/src/docs/openapi.json'
    ),
}));

test('should write the OpenAPI JSON to a file', () => {
    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

    expect(writeFileSyncMock).toHaveBeenCalledWith('/src/docs/openapi.json'
        , JSON.stringify(openApiDocument, null, 2));

});