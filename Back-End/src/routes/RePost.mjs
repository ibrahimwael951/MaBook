import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { RePost } from "../mongoose/schema/RePost.mjs";
import {
  RePostsValidation,
  UpdateRePostsValidation,
} from "../validator/RePost.mjs";
import mongoose from "mongoose";
import { Posts } from "../mongoose/schema/Posts.mjs";
import { user } from "../mongoose/schema/UserAuth.mjs";

const router = Router();

router.get("/api/RePost", async (req, res) => {
  try {
    const author = req.user.username;
    const limit = parseInt(req.query.limit) || 5;
    const lastDate = req.query.lastDate;

    const query = { author };
    if (lastDate) {
      query.createdAt = { $lt: new Date(lastDate) };
    }

    const rePosts = await RePost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "postId",
        model: "Posts",
        select: "-__v -updatedAt",
      });

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
 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const findRePost = await RePost.findOne({ _id: id }).lean();
    if (!findRePost) {
      return res.status(404).json({ message: "Repost not found" });
    }

    const RepostUser = await user
      .findOne(findRePost.userId)
      .select("username avatar")
      .lean();

    if (!RepostUser) {
      return res.status(404).json({ message: "Repost user not found" });
    }

    const FindPost = await Posts.findById(findRePost.postId).lean();
    if (!FindPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const PostUser = await user
      .findOne({ username: FindPost.author })
      .select("username avatar")
      .lean();

    if (!PostUser) {
      return res.status(404).json({ message: "Post user not found" });
    }

    const { _id: repostUserId, ...safeRepostUser } = RepostUser;
    const { _id: postUserId, ...safePostUser } = PostUser;

    res.status(200).json({
      repost: {
        ...findRePost,
        author: {
          ...safeRepostUser,
          avatar: RepostUser?.avatar?.url ?? RepostUser?.avatar,
        },
      },
      post: {
        ...FindPost,
        author: {
          ...safePostUser,
          avatar: PostUser?.avatar?.url ?? PostUser?.avatar,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      details: err.message,
    });
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
    const author = req.user.username;

    const NewData = new RePost({ ...data, author });
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
