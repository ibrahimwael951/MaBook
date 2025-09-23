import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
import Avatar from "./Avatar.mjs";
import Social from "./Social.mjs";
import posts from "./Post.mjs";
import Check from "./Check.mjs";

import Likes from "./Likes.mjs";
import Comments from "./Comments.mjs";
import MyBooks from "./MyBooks.mjs";
const router = Router();

router.use(UserAuth);
router.use(Avatar);
router.use(Social);
router.use(posts);
router.use(Check);
router.use(Likes);
router.use(Comments);
router.use(MyBooks);

export default router;
