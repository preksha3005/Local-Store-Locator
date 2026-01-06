import express from "express";
import Store from "../models/Store.js";
import { protect, ownerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADD STORE (Owner) */
router.post("/add", protect, ownerOnly, async (req, res) => {
  const { name, category, lat, lng } = req.body;

  try {
    const store = await Store.create({
      name,
      category,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      ownerId: req.user.id,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: "Failed to add store" });
  }
});

/* GET OWNER STORES */
router.get("/my", protect, ownerOnly, async (req, res) => {
  const stores = await Store.find({ ownerId: req.user.id });
  res.json(stores);
});

/* DELETE STORE */
router.delete("/delete/:id", protect, ownerOnly, async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  res.json({ message: "Store deleted" });
});

/* UPDATE STORE */
router.put("/update/:id", protect, ownerOnly, async (req, res) => {
  const { name, category, lat, lng } = req.body;

  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Ensure store belongs to logged-in owner
    if (store.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this store" });
    }

    // Update basic fields if provided
    if (name) store.name = name;
    if (category) store.category = category;

    // Update location only if new coordinates are sent
    if (lat && lng) {
      store.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    res.status(500).json({ message: "Failed to update store" });
  }
});

/* NEARBY STORES (User) */
router.get("/nearby", protect, async (req, res) => {
  const { lat, lng } = req.query;

  const stores = await Store.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 4000,
      },
    },
  });

  res.json(stores);
});

/* GET STORE BY ID (for Edit) */
router.get("/:id", protect, ownerOnly, async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  if (store.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(store);
});

export default router;
