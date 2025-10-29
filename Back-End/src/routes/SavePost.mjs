import { Router } from "express";
import { validationResult } from "express-validator";
import { SavePost } from "../mongoose/schema/SavePost.mjs";

const router = Router();

router.get("/api/MySave", async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;
    const lastDate = req.query.lastDate;

    const query = { userId };
    if (lastDate) {
      query.createdAt = { $lt: new Date(lastDate) };
    }

    const findAllPost = await SavePost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "postId", 
        model: "Posts", 
        select: "-__v -updatedAt",
      })
      .select("-userId");
    res.status(200).json(findAllPost);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

router.get("/api/post/save/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const findPost = await SavePost.findOne({ _id: id, userId });
    if (!findPost) {
      return res.status(400).json({ message: "post not found" });
    }
    res.status(200).json(findPost);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

router.post("/api/post/save/:postId", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const userId = req.user._id;

    const newSavedPost = new SavePost({ postId, userId });
    const saved = await newSavedPost.save();

    res.status(200).json({ message: "Saved successfully", data: saved });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Post already saved" });
    }
    res.status(500).json({ message: "Server Error", details: err.message });
  }
});

router.delete("/api/post/save/:postId", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const userId = req.user._id;

    const deleted = await SavePost.findOneAndDelete({ postId, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Saved post not found" });
    }

    res.status(200).json({ message: "Removed from saved posts" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", details: err.message });
  }
});

export default router;
