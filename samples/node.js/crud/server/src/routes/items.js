import { Router } from "express";
import Item from "../models/item.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await Item.findAll({ order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }
    const item = await Item.create({
      name: name.trim(),
      description: description?.trim() || null
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }
    item.name = name.trim();
    item.description = description?.trim() || null;
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
