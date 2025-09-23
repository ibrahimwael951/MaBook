import { Router } from "express";
import {
  handleAvatarRemove,
  handleAvatarUpload,
} from "../controllers/User_Avatar.mjs";
import { user } from "../mongoose/schema/UserAuth.mjs";
import multer from "multer";
import passport from "passport";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.patch(
  "/api/auth/update/avatar",
  upload.single("avatar"),
  passport.authenticate("session"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.file.mimetype || !req.file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Uploaded file is not an image" });
      }

      const _id = req.user._id;
      const existingUser = await user.findById(_id).exec();

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldAvatar = existingUser.avatar ?? null;
      let imageUrl;

      try {
        if (oldAvatar) {
          // Replace old avatar
          imageUrl = await handleAvatarUpload(req.file, req.user, oldAvatar);
        } else {
          // Upload new avatar
          imageUrl = await handleAvatarUpload(req.file, req.user);
        }
      } catch (uploadErr) {
        return res.status(500).json({
          message: `Image upload failed: ${uploadErr?.message || uploadErr}`,
        });
      }

      const updated = await user
        .findByIdAndUpdate(_id, { $set: { avatar: imageUrl } }, { new: true })
        .lean();

      if (!updated) {
        return res.status(404).json({ message: "User not found after update" });
      }

      delete updated.password;
      delete updated.__v;

      return res.status(200).json({
        message: "Updated successfully",
        user: updated,
      });
    } catch (err) {
      console.error("Avatar update failed:", err);
      return res.status(err?.status || 500).json({
        message: err?.message || "Failed to update avatar",
      });
    }
  }
);

router.delete(
  "/api/auth/update/avatar",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const user = req.user;
      const deleted = await handleAvatarRemove(user.avatar, user);
      if (!deleted)
        return res.status(404).json({ success: false, msg: "user not found" });
      res.status(200).json({ success: true, post: deleted });
    } catch (error) {
      console.error("Delete Avatar error:", error);
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
