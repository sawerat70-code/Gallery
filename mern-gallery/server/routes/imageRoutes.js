import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Image from "../models/Image.js";
import upload from "../middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

const router = express.Router();

const processTags = (tagsInput) => {
  if (!tagsInput) return [];

  const rawArray = Array.isArray(tagsInput)
    ? tagsInput
    : typeof tagsInput === "string"
      ? tagsInput.split(",")
      : [];

  if (rawArray.some((tag) => typeof tag !== "string")) {
    throw new Error("Tags must be strings");
  }

  return rawArray
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0)
    .slice(0, 5);
};

// POST /api/images -> Receive file & metadata
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file received" });
    if (!req.body.title || !req.body.title.trim()) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: "Title is required" });
    }

    const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${base}/uploads/${req.file.filename}`;
    
    const tags = processTags(req.body.tags);

    const image = await Image.create({
      imageUrl,
      title: req.body.title,
      description: req.body.description || "",
      tags,
    });

    res.status(201).json(image);
  } catch (err) {
  if (req.file?.path) {
    await fs.promises.unlink(req.file.path).catch(() => {});
  }

  const status = err.name === "ValidationError" || err.message === "Tags must be strings" ? 400 : 500;
  res.status(status).json({ message: err.message });
  }
});

// GET /api/images -> Search, Filter, Sort
router.get("/", async (req, res) => {
  try {
    const { search, favorite, sort } = req.query;
    let query = {};

    if (favorite === "true") {
      query.isFavorite = true;
    }

    if (search && search.trim() !== "") {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const images = await Image.find(query).sort(sortOption);
    res.json(images);
  } catch (err) {
    res.status(err.name === "ValidationError" ? 400 : 500).json({ message: err.message });
  }
});

// PATCH /api/images/:id -> Update Metadata
router.patch("/:id", async (req, res) => {
if (!mongoose.isValidObjectId(req.params.id)) {
  return res.status(400).json({ message: "Invalid image ID" });
}
  try {
    const { title, description, tags } = req.body;
    
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = processTags(tags);

    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Image not found" });
    res.json(updated);
  } catch (err) {
    const status = err.name === "ValidationError" || err.message === "Tags must be strings" ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});
router.patch("/:id/favorite", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }

  if (typeof req.body.isFavorite !== "boolean") {
    return res.status(400).json({
      message: "isFavorite must be a boolean",
    });
  }

  try {
    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      { isFavorite: req.body.isFavorite },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(err.name === "ValidationError" || err.message === "Tags must be strings" ? 400 : 500)
      .json({ message: err.message });
  }
});

// DELETE /api/images/:id -> Remove record & file
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }

  try {
    const deleted = await Image.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Image not found" });

    const filename = deleted.imageUrl.split("/uploads/")[1];
    if (filename) {
      try {
        await fs.promises.unlink(path.join(uploadDir, filename));
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Failed to delete image file:", err.message);
        }
      }
    }

    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(err.name === "ValidationError" ? 400 : 500).json({ message: err.message });
  }
});

export default router;