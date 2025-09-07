import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
import Social from "./Social.mjs";
import posts from "./Post.mjs";
import Check from "./Check.mjs";

import Likes from "./Likes.mjs";
import Comments from "./Comments.mjs";
const router = Router();

router.use(UserAuth);
router.use(Social);
router.use(posts);
router.use(Check);
router.use(Likes);
router.use(Comments);

export default router;
