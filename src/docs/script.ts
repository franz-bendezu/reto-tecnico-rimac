import fs from 'fs';
import path from 'path'; 
import { openApiDocument } from './openapi-definitions';

// script for writing the OpenAPI JSON to a file
fs.writeFileSync(path.join(__dirname, 'openapi.json'), JSON.stringify(openApiDocument, null, 2));