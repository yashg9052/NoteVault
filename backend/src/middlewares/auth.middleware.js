import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};