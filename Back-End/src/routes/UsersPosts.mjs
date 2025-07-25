import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";
import { PostComments } from "../mongoose/schema/PostsComments.mjs";
import { findPostIdAndAuthor, findUserName } from "../util/middlewares.mjs";
import { PostComment, PostSchema } from "../util/ValidationSchema.mjs";
const router = Router();

router.post(
  "/api/post",
  findUserName,
  checkSchema(PostSchema),
  async (req, res) => {
    const { findUserName } = req;
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const postData = matchedData(req);
    const fullPostData = new UsersPosts({
      author: findUserName,
      ...postData,
    });
    try {
      const SavePost = await fullPostData.save();
      return res.status(200).send(SavePost);
    } catch (err) {
      res.status(400).send(`Error : ${err}`);
    }
  }
);





export default router;
