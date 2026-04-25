// Tests for Auth Validators
const { registerSchema, loginSchema } = require('./auth.validator.js');

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should validate a correct registration payload', () => {
      const validPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPayload);
    });

    it('should fail with name less than 2 characters', () => {
      const invalidPayload = {
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
    });

    it('should fail with invalid email', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Invalid email');
    });

    it('should fail with password less than 6 characters', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'pass',
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
    });
  });

  describe('loginSchema', () => {
    it('should validate a correct login payload', () => {
      const validPayload = {
        email: 'john@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPayload);
    });

    it('should fail with invalid email', () => {
      const invalidPayload = {
        email: 'not-an-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should fail with missing password', () => {
      const invalidPayload = {
        email: 'john@example.com',
        password: '',
      };
      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Password is required');
    });

    it('should fail with missing email', () => {
      const invalidPayload = {
        email: '',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
