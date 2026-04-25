import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
});

export const transferNoteSchema = z.object({
  email: z.string().email("Provide a valid recipient email"),
});