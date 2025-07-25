import { Router } from "express";
import {
  findPostIdAndAuthor,
  findUserName,
  getUserByUsername,
} from "../util/middlewares.mjs";
import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { PostComments } from "../mongoose/schema/PostsComments.mjs";
import { PostComment } from "../util/ValidationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";

const router = Router();
router.get("/api/user/:username", getUserByUsername, async (req, res) => {
  const { findUser } = req;
  return res.status(200).send(findUser);
});

router.get("/api/user/:username/posts", getUserByUsername, async (req, res) => {
  const { findUser } = req;
  try {
    const getPosts = await UsersPosts.find({ author: findUser.username });
    return res.status(200).send(getPosts);
  } catch (err) {
    return res.status(400).send(`error : ${err}`);
  }
});

router.get("/api/post/:id", async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const post = await UsersPosts.findById(id);
    const commentsCount = await PostComments.countDocuments({
      postId: post.toObject()._id,
    });
 
    return res.status(200).json({
      post,
      commentsCount,
    });
  } catch (err) {
    return res.status(400).send(`Error : ${err}`);
  }
});

router.post(
  "/api/post/:id/comment",
  checkSchema(PostComment),
  findUserName,
  findPostIdAndAuthor,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ Errors: result.array() });
    const data = matchedData(req);
    const { findPostIdAndAuthor, findUserName } = req;
    const updatedPost = new PostComments({
      text: data.text,
      postId: findPostIdAndAuthor._id,
      author: findUserName,
    });
    try {
      const SavePost = await updatedPost.save();
      return res.send(SavePost);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

router.get("/api/post/:id/comments", findPostIdAndAuthor, async (req, res) => {
  const { findPostIdAndAuthor } = req;
  try {
    const GetsComments = await PostComments.find({
      postId: findPostIdAndAuthor._id,
    });
    return res.status(200).send(GetsComments);
  } catch (err) {
    return res.status(400).send(`error : ${err}`);
  }
});

export default router;
