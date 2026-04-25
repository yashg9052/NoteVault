// Tests for Notes Validators
const { createNoteSchema, updateNoteSchema, transferNoteSchema } = require('./notes.validator.js');

describe('Notes Validators', () => {
  describe('createNoteSchema', () => {
    it('should validate a correct note creation payload', () => {
      const validPayload = {
        title: 'My First Note',
        content: 'This is my first note',
        category: 'Work',
      };
      const result = createNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPayload);
    });

    it('should validate without category (optional field)', () => {
      const validPayload = {
        title: 'My First Note',
        content: 'This is my first note',
      };
      const result = createNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      expect(result.data.category).toBeUndefined();
    });

    it('should fail with empty title', () => {
      const invalidPayload = {
        title: '',
        content: 'This is my first note',
        category: 'Work',
      };
      const result = createNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Title is required');
    });

    it('should fail with empty content', () => {
      const invalidPayload = {
        title: 'My First Note',
        content: '',
        category: 'Work',
      };
      const result = createNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Content is required');
    });

    it('should fail with missing title', () => {
      const invalidPayload = {
        content: 'This is my first note',
        category: 'Work',
      };
      const result = createNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateNoteSchema', () => {
    it('should validate with all optional fields', () => {
      const validPayload = {
        title: 'Updated Title',
        content: 'Updated content',
        category: 'Personal',
      };
      const result = updateNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should validate with only title', () => {
      const validPayload = {
        title: 'Updated Title',
      };
      const result = updateNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should validate with only content', () => {
      const validPayload = {
        content: 'Updated content',
      };
      const result = updateNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should validate with empty object', () => {
      const validPayload = {};
      const result = updateNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail with empty title string', () => {
      const invalidPayload = {
        title: '',
      };
      const result = updateNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('transferNoteSchema', () => {
    it('should validate correct recipient email', () => {
      const validPayload = {
        email: 'recipient@example.com',
      };
      const result = transferNoteSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const invalidPayload = {
        email: 'not-an-email',
      };
      const result = transferNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Provide a valid recipient email');
    });

    it('should fail with missing email', () => {
      const invalidPayload = {};
      const result = transferNoteSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
