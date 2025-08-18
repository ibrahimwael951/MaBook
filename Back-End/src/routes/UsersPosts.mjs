import express from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import multer from "multer";

import { SaveUserData } from "../middleware/userMiddleware.mjs";
import { PostSchema } from "../util/ValidationSchema.mjs";
import * as postController from "../controllers/postController.mjs";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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

 

export default router;