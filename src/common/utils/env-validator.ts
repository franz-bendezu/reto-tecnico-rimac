/**
 * Obtiene el valor de una variable de entorno o lanza un error si no está definida
 * @param key El nombre de la variable de entorno
 * @param errorMessage Mensaje de error personalizado (opcional)
 * @returns El valor de la variable de entorno
 */
export function getRequiredEnv(key: string, errorMessage?: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(errorMessage || `${key} is not defined`);
  }
  return value;
}

/**
 * Obtiene una variable de entorno numérica o lanza un error si no es válida
 * @param key El nombre de la variable de entorno
 * @param errorMessage Mensaje de error personalizado (opcional)
 * @returns El valor numérico parseado
 */
export function getRequiredNumericEnv(key: string, errorMessage?: string): number {
  const value = getRequiredEnv(key, errorMessage);
  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    throw new Error(errorMessage || `${key} must be a valid number`);
  }
  return numValue;
}
