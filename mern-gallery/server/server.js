import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Serve the uploads folder publicly, so every saved file has its own URL:
//   /uploads/1710240000000-beach.jpg  ->  http://localhost:5000/uploads/1710240000000-beach.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/images", imageRoutes);
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image must be smaller than 5 MB",
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  console.error("Unhandled server error:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err.message));
