import { getRequiredEnv, getRequiredNumericEnv } from '../env-validator';

describe('Environment Variable Validators', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('getRequiredEnv', () => {
    it('should return the environment variable value when it exists', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getRequiredEnv('TEST_VAR')).toBe('test-value');
    });

    it('should throw error when environment variable does not exist', () => {
      delete process.env.TEST_VAR;
      expect(() => getRequiredEnv('TEST_VAR')).toThrow('TEST_VAR is not defined');
    });

    it('should throw custom error message when provided', () => {
      delete process.env.TEST_VAR;
      expect(() => getRequiredEnv('TEST_VAR', 'Custom error')).toThrow('Custom error');
    });
  });

  describe('getRequiredNumericEnv', () => {
    it('should return the numeric value when it exists and is valid', () => {
      process.env.NUM_VAR = '123';
      expect(getRequiredNumericEnv('NUM_VAR')).toBe(123);
    });

    it('should throw error when environment variable does not exist', () => {
      delete process.env.NUM_VAR;
      expect(() => getRequiredNumericEnv('NUM_VAR')).toThrow('NUM_VAR is not defined');
    });

    it('should throw error when environment variable is not a valid number', () => {
      process.env.NUM_VAR = 'not-a-number';
      expect(() => getRequiredNumericEnv('NUM_VAR')).toThrow('NUM_VAR must be a valid number');
    });

    it('should throw custom error message when provided', () => {
      process.env.NUM_VAR = 'not-a-number';
      expect(() => getRequiredNumericEnv('NUM_VAR', 'Custom error')).toThrow('Custom error');
    });
  });
});
