import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  transferNote,
  getTransferHistory,
  getUserCategories
} from "../controllers/notes.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createNoteSchema, updateNoteSchema, transferNoteSchema } from "../validators/notes.validator.js";
import { createNoteLimiter, transferLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Protect all routes
router.use(protect);


router.get("/transfers", getTransferHistory);
router.get("/categories", getUserCategories);


router.get("/", getAllNotes);
// Apply rate limiting to note creation to prevent spam
router.post("/", createNoteLimiter, validate(createNoteSchema), createNote);


router.get("/:id", getNoteById);
router.put("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);
// Apply stricter rate limiting to transfers to prevent abuse
router.post("/:id/transfer", transferLimiter, validate(transferNoteSchema), transferNote);

export default router;