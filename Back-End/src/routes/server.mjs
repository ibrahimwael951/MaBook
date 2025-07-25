import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
import Social from "./Social.mjs";
import posts from "./UsersPosts.mjs"
const router = Router();

router.use(UserAuth);
router.use(Social);
router.use(posts)
export default router;
