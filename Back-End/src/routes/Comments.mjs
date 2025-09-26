import { Router } from "express";
import { findPostIdAndAuthor } from "../middleware/userMiddleware.mjs";

import { PostComments } from "../mongoose/schema/PostsComments.mjs";
import { PostComment } from "../validator/Post.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import passport from "passport";

const router = Router();

router.post(
  "/api/post/:id/comment",
  checkSchema(PostComment),
  passport.authenticate("session"),
  findPostIdAndAuthor,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ Errors: result.array() });
    const data = matchedData(req);
    const { findPostIdAndAuthor, user } = req;
    const updatedPost = new PostComments({
      text: data.text,
      postId: findPostIdAndAuthor._id,
      author: user.username,
    });
    try {
      const SavePost = await updatedPost.save();
      return res.send(SavePost);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

router.get(
  "/api/post/:id/comments",
  passport.authenticate("session"),
  findPostIdAndAuthor,
  async (req, res) => {
    const { findPostIdAndAuthor } = req;
    try {
      const GetsComments = await PostComments.find({
        postId: findPostIdAndAuthor._id,
      });

      return res.status(200).send(GetsComments);
    } catch (err) {
      return res.status(400).send(`error : ${err}`);
    }
  }
);

router.delete("/api/Comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const comment = await PostComments.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.author != user.username)
      return res
        .status(401)
        .json({ message: "You are not allowed to delete this comment" });

    await PostComments.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully " });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", details: err.message });
  }
});
export default router;
