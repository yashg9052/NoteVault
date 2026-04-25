import { prisma } from "../lib/prisma.js";

// POST /api/notes
export const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

// GET /api/notes?search=&category=&page=1&limit=10
export const getAllNotes = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
  ownerId: req.user.id,
  ...(category && { category }),
  ...(search && {
    OR: [
      { title:    { contains: search, mode: "insensitive" } },
      { content:  { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } }, // ✅ search by category too
    ],
  }),
};

    const [notes, total] = await prisma.$transaction([
      prisma.note.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.note.count({ where }),
    ]);

    res.json({
      notes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
};

// GET /api/notes/:id
export const getNoteById = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: {
        transfers: {
          include: {
            fromUser: { select: { id: true, name: true, email: true } },
            toUser: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.ownerId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note", error: err.message });
  }
};

// PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.ownerId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    const updated = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category !== undefined && { category }),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note", error: err.message });
  }
};

// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.ownerId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    await prisma.note.delete({ where: { id: req.params.id } });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};

// POST /api/notes/:id/transfer
export const transferNote = async (req, res) => {
  try {
    const { email } = req.body;

    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.ownerId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    const recipient = await prisma.user.findUnique({ where: { email } });
    if (!recipient) return res.status(404).json({ message: "Recipient user not found" });

    if (recipient.id === req.user.id)
      return res.status(400).json({ message: "Cannot transfer note to yourself" });

    // Use a transaction to update owner + log transfer atomically
    const [updatedNote, transfer] = await prisma.$transaction([
      // Transfer ownership
      prisma.note.update({
        where: { id: req.params.id },
        data: { ownerId: recipient.id },
      }),
      // Log in NoteTransfer table
      prisma.noteTransfer.create({
        data: {
          noteId: req.params.id,
          fromUserId: req.user.id,
          toUserId: recipient.id,
        },
        include: {
          fromUser: { select: { id: true, name: true, email: true } },
          toUser: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    res.json({
      message: `Note transferred to ${email}`,
      note: updatedNote,
      transfer,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to transfer note", error: err.message });
  }
};

// GET /api/notes/transfers  — full transfer history for logged in user
export const getTransferHistory = async (req, res) => {
  try {
    const transfers = await prisma.noteTransfer.findMany({
      where: {
        OR: [
          { fromUserId: req.user.id },
          { toUserId: req.user.id },
        ],
      },
      include: {
        note: { select: { id: true, title: true } },
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transfer history", error: err.message });
  }
};
// GET /api/notes/categories
export const getUserCategories = async (req, res) => {
  try {
    const result = await prisma.note.groupBy({
      by: ["category"],
      where: {
        ownerId: req.user.id,
        category: { not: null },
      },
      _count: { category: true },
    });

    const categories = result.map((r) => ({
      name: r.category,
      count: r._count.category,
    }));

    const total = await prisma.note.count({
      where: { ownerId: req.user.id },
    });

    res.json({ categories, total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
};