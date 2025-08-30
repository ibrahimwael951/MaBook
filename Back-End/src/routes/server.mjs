import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
import Social from "./Social.mjs";
import posts from "./UsersPosts.mjs";
import Check from "./Check.mjs";
import SocialPosts from "./Post.mjs";
const router = Router();

router.use(UserAuth);
router.use(Social);
router.use(posts);
router.use(Check);
router.use(SocialPosts);

export default router;
