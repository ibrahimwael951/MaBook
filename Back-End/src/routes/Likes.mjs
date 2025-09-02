import Router from "express";
import { Likes } from "../mongoose/schema/Likes.mjs";

import passport from "passport";
import { Posts } from "../mongoose/schema/UsersPosts.mjs";

const router = Router();

router.post(
  "/api/:id/like",
  passport.authenticate("session"),
  async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
      const post = await Posts.findById(id);
      if (!post) {
        return res.status(404).json({ message: "No Post Found" });
      }

      const existing = await Likes.findOne({ postId: id, userId });

      if (existing) {
        await Likes.deleteOne({ _id: existing._id });
        return res.status(200).json({
          message: "Like removed",
          liked: false,
        });
      }

      const like = new Likes({ postId: id, userId });
      const savedLike = await like.save();

      return res.status(201).json({
        message: "Post liked",
        liked: true,
        like: savedLike,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        error: err.message,
      });
    }
  }
);

export default router;
