import { Router } from "express";
import UserAuth from "./UserAuth.mjs";
const router = Router();

router.use(UserAuth);

export default router;
