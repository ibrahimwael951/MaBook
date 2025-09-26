import { Router } from "express";
import { checkSchema } from "express-validator";
import { RePost } from "../mongoose/schema/RePost.mjs";
import {
  RePostsValidation,
  UpdateRePostsValidation,
} from "../validator/RePost.mjs";

const router = Router();

router.get("/api/RePost", async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;
    const lastDate = req.query.lastDate;

    const query = { userId };
    if (lastDate) {
      query.createdAt = { $lt: new Date(lastDate) };
    }

    const rePosts = (await RePost.find(query))
      .toSorted({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(rePosts);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

router.get("/api/RePost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const findPost = await RePost.findOne({ _id: id, userId });
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

router.post("/api/RePost", checkSchema(RePostsValidation), async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    const data = matchedData(req);
    const userId = req.user._id;

    const NewData = new RePost({ ...data, userId });
    const SaveData = await NewData.save();

    if (!SaveData) {
      return res
        .status(400)
        .json({ message: "Some thing went wrong while save" });
    }

    res.status(200).json(SaveData);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

router.patch(
  "/api/RePost/:RePost_id",
  checkSchema(UpdateRePostsValidation),
  async (req, res) => {
    try {
      const { RePost_id } = req.params;

      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array(),
        });
      }

      const data = matchedData(req);

      const RePostData = await RePost.findById(RePost_id);
      if (!RePostData) {
        return res.status(404).json({ message: "RePost not found" });
      }

      if (RePostData.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not Authorized" });
      }

      const updateData = await RePost.findByIdAndUpdate(RePost_id, data, {
        new: true,
      });

      res.status(200).json(updateData);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", details: err.message });
    }
  }
);

router.delete("/api/RePost/:RePost_Id", async (req, res) => {
  try {
    const { RePost_Id } = req.params;
    const userId = req.user._id;

    const RePostData = await RePost.findById(RePost_Id);

    if (!RePostData) {
      return res.status(404).json({ message: "RePost not found" });
    }
    if (RePostData.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    await RePost.findOneAndDelete({
      _id: RePost_Id,
      userId: userId,
    });

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

export default router;
