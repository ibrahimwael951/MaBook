import express from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import multer from "multer";

import { SaveUserData } from "../middleware/userMiddleware.mjs";
import { PostSchema } from "../util/ValidationSchema.mjs";
import * as postController from "../controllers/postController.mjs";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/api/post",
  SaveUserData,
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
        req.UserData,
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
  SaveUserData,
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
        req.UserData,
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

router.delete("/api/post/:id", SaveUserData, async (req, res) => {
  try {
    const postId = req.params.id;
    const deleted = await postController.deletePost(postId, req.UserData);
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
});

export default router;
