import express from "express";
import cors from "cors";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";


const app = express();
console.log(process.env.CLIENT_URL)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());


app.use(generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => res.json({ message: "Notes API running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;