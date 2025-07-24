import { Router } from "express";
import { UpDateUserData, UserLoggingIn } from "../util/ValidationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { hashPassword } from "../util/Hashing.mjs";
import passport from "passport";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { resolveUserLoggedIn } from "../util/middlewares.mjs";

const router = Router();

router.post("/api/user", checkSchema(UserLoggingIn), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).send({ Errors: result.array() });
  const data = matchedData(req);
  data.password = hashPassword(data.password);
  const newUser = new user(data);
  try {
    const saveUser = await newUser.save();
    return res.status(200).send(saveUser);
  } catch (err) {
    res.status(400).send(`Errors: ${err}`);
  }
});

router.post("/api/user/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.patch(
  "/api/user/update",
  resolveUserLoggedIn,
  checkSchema(UpDateUserData),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ Errors: result.array() });
    const data = matchedData(req);
    const { findUserId } = req;
    try {
     const updatedUser = await user.findOneAndUpdate(
        { _id: findUserId },
        { $set: data },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).send(`Error : ${err}`);
    }
  }
);

router.get("/api/user/status", (req, res) => {
  return req.user
    ? res.send(req.user)
    : res.status(401).send({ msg: "Not Authentication" });
});

router.delete("/api/user/delete", resolveUserLoggedIn, async (req, res) => {
  const { findUser } = req;
  try {
    await user.findByIdAndDelete({ findUser });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).send(`Error: ${err}`);
  }
});

export default router;
