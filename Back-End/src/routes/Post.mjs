// routes/posts.mjs
import express from "express";
import { Types } from "mongoose";
import passport from "passport";
import { Posts } from "../mongoose/schema/Posts.mjs";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { PostComments } from "../mongoose/schema/PostsComments.mjs";
import { Likes } from "../mongoose/schema/Likes.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import multer from "multer";

import { PostSchema } from "../util/ValidationSchema.mjs";
import * as postController from "../controllers/postController.mjs";

const router = express.Router();

function parseCursor(cursor) {
  if (!cursor) return null;
  try {
    const decoded = Buffer.from(String(cursor), "base64").toString("utf8");
    const obj = JSON.parse(decoded);
    return { createdAt: new Date(obj.createdAt), _id: Types.ObjectId(obj._id) };
  } catch {
    return null;
  }
}

function makeCursor(post) {
  return Buffer.from(
    JSON.stringify({
      createdAt: post.createdAt.toISOString(),
      _id: post._id.toString(),
    })
  ).toString("base64");
}

router.get("/api/posts", passport.authenticate("session"), async (req, res) => {
  try {
    const limit = Math.min(
      100,
      parseInt(String(req.query.limit || "10"), 10) || 10
    );
    const cursor = parseCursor(req.query.cursor);

    const query = {};
    if (cursor) {
      query.$or = [
        { createdAt: { $lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
      ];
    }

    const docs = await Posts.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const page = hasMore ? docs.slice(0, limit) : docs;

    const nextCursor =
      page.length > 0 ? makeCursor(page[page.length - 1]) : null;

    const enriched = await Promise.all(
      page.map(async (p) => {
        const Author = await user
          .findOne({ username: p.author })
          .select("username fullName gender avatar")
          .lean();

        const commentsCount = await PostComments.countDocuments({
          postId: p._id,
        });
        const userId = req.user._id;
        const Liked = await Likes.findOne({
          postId: p._id,
          userId,
        });
        const LikesCount = await Likes.countDocuments({
          postId: p._id,
        });
        const IsLiked = Liked ? true : false;
        return {
          ...p,
          author: {
            username: Author.username,
            fullName: Author.fullName,
            gender: Author.gender,
            avatar: Author.avatar,
          },
          Liked: IsLiked,
          LikesCount,
          commentsCount,
        };
      })
    );

    return res.json({ posts: enriched, nextCursor, hasMore });
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/post/:id", async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const Author = await user.findOne({ username: post.author });
    if (!Author) {
      return res.status(401).json({ message: "No Author Found" });
    }

    const comments = await PostComments.find({ postId: id }).lean();
    const commentsCount = comments.length;
    const userId = req.user._id;
    const Liked = await Likes.findOne({
      postId: post._id,
      userId,
    });
    const LikesCount = await Likes.countDocuments({
      postId: post._id,
    });
    const IsLiked = Liked ? true : false;
    const DataSend = {
      ...post.toObject(),
      author: {
        username: Author.username,
        fullName: Author.fullName,
        gender: Author.gender,
        avatar: Author.avatar,
      },
      Liked: IsLiked,
      LikesCount,
      commentsCount,
    };

    return res.status(200).json(DataSend);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error: ${err instanceof Error ? err.message : err}` });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/api/post",
  passport.authenticate("session"),

  upload.single("image"),
  checkSchema(PostSchema),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const postData = matchedData(req);
      const savedPost = await postController.createPost(
        req.user,
        postData,
        req.file
      );

      res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
      console.error("Error:", error.message);
      const status = error.message.includes("requires text") ? 400 : 500;
      res.status(status).json({ success: false, msg: error.message });
    }
  }
);
router.put(
  "/api/post/:id",
  passport.authenticate("session"),
  upload.single("image"),

  checkSchema(PostSchema),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const postId = req.params.id;

      const postData = matchedData(req);
      const updatedPost = await postController.updatePost(
        postId,
        req.user,
        postData,
        req.file
      );

      res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
      console.error("Update post error:", error);
      const status = error.message.includes("Not authorized")
        ? 403
        : error.message.includes("not found")
        ? 404
        : 500;
      res.status(status).json({ success: false, msg: error.message });
    }
  }
);

router.delete(
  "/api/post/:id",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const postId = req.params.id;
      const deleted = await postController.deletePost(postId, req.user);
      if (!deleted)
        return res.status(404).json({ success: false, msg: "Post not found" });
      res.status(200).json({ success: true, post: deleted });
    } catch (error) {
      console.error("Delete post error:", error);
      const status = error.message.includes("Not authorized")
        ? 403
        : error.message.includes("not found")
        ? 404
        : 500;
      res.status(status).json({ success: false, msg: error.message });
    }
  }
);

export default router;
