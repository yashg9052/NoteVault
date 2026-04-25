const { z } = require("zod");

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
});

const transferNoteSchema = z.object({
  email: z.string().email("Provide a valid recipient email"),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  transferNoteSchema,
};