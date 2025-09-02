import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
import Social from "./Social.mjs";
import posts from "./UsersPosts.mjs";
import Check from "./Check.mjs";
import SocialPosts from "./Post.mjs";
import Likes from "./Likes.mjs";
const router = Router();

router.use(UserAuth);
router.use(Social);
router.use(posts);
router.use(Check);
router.use(Likes);
router.use(SocialPosts);

export default router;
