import { Router } from "express";
import { getUserByUsername } from "../middleware/userMiddleware.mjs";
import { Posts } from "../mongoose/schema/Posts.mjs";

const router = Router();

router.get(
  "/api/user/search/:username",
  getUserByUsername,
  async (req, res) => {
    const { findUser } = req;
    const UserData = { ...findUser };
    if (req.user.gender === UserData.gender) {
      if (UserData.avatar.url) {
        UserData.avatar = UserData.avatar.url;
      }
    } else {
      UserData.avatar = null;
    }
    return res.status(200).send(UserData);
  }
);

router.get("/api/user/:username/posts", getUserByUsername, async (req, res) => {
  const { findUser } = req;
  try {
    const getPosts = await Posts.find({ author: findUser.username });
    return res.status(200).send(getPosts);
  } catch (err) {
    return res.status(400).send(`error : ${err}`);
  }
});

export default router;
