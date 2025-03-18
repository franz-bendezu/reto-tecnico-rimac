/**
 * Gets an environment variable value or throws an error if it's not defined
 * @param key The environment variable name
 * @param errorMessage Custom error message (optional)
 * @returns The environment variable value
 */
export function getRequiredEnv(key: string, errorMessage?: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(errorMessage || `${key} is not defined`);
  }
  return value;
}

/**
 * Gets a numeric environment variable or throws an error if it's not valid
 * @param key The environment variable name
 * @param errorMessage Custom error message (optional)
 * @returns The parsed numeric value
 */
export function getRequiredNumericEnv(key: string, errorMessage?: string): number {
  const value = getRequiredEnv(key, errorMessage);
  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    throw new Error(errorMessage || `${key} must be a valid number`);
  }
  return numValue;
}
