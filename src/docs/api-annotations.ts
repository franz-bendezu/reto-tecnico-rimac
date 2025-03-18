// Simple annotation system for documentation

export type ApiOperationOptions = {
  summary: string;
  description?: string;
  tags?: string[];
  requestBody?: {
    description?: string;
    required?: boolean;
    contentType?: string;
  };
  responses?: {
    [statusCode: string]: {
      description: string;
      schema?: any;
    };
  };
  parameters?: {
    name: string;
    in: 'path' | 'query' | 'header';
    description?: string;
    required?: boolean;
    schema?: any;
  }[];
};

// Metadata storage
const metadataStore: Record<string, any> = {};

// Decorator for API operations
export function ApiOperation(options: ApiOperationOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const controllerName = target.constructor.name;
    if (!metadataStore[controllerName]) {
      metadataStore[controllerName] = {};
    }
    metadataStore[controllerName][propertyKey] = options;
    return descriptor;
  };
}

// Get all metadata
export function getApiMetadata() {
  return metadataStore;
}
