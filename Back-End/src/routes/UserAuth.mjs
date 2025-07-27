import { Router } from "express";
import { UpDateUserData, UserLoggingIn } from "../util/ValidationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { hashPassword } from "../util/Hashing.mjs";
import passport from "passport";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { resolveUserLoggedIn, SaveUserData } from "../middleware/userMiddleware.mjs";

const router = Router();

router.post("/api/user", checkSchema(UserLoggingIn), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).send({ Errors: result.array() });
  const data = matchedData(req);
  data.password = hashPassword(data.password);
  const newUser = new user({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
  });
  try {
    const UserData = await newUser.save();
    const saveUser = UserData.toObject();
    delete saveUser._id;
    delete saveUser.__v;
    delete saveUser.password;

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
      const SaveUserData = updatedUser.toObject();
      delete SaveUserData.password;
      return res.status(200).json(SaveUserData);
    } catch (err) {
      res.status(400).send(`Error : ${err}`);
    }
  }
);

router.get("/api/user/status", SaveUserData, (req, res) => {
  const { SaveUserData } = req;
  return SaveUserData
    ? res.send(SaveUserData)
    : res.status(401).send({ msg: "Not Authentication" });
});

router.post("/api/user/logout", (req, res) => {
  if (!req.user) return res.status(401).send({ msg: "no Authentication" });
  req.logout((err) => {
    if (err) res.sendStatus(400);
    res.sendStatus(200);
  });
});

router.delete("/api/user/delete", resolveUserLoggedIn, async (req, res) => {
  const { findUserId } = req;

  try {
    await user.findByIdAndDelete(findUserId);

    req.logout((err) => {
      if (err) {
        return res.status(400).send(`Logout Error: ${err}`);
      }
      return res.sendStatus(200);
    });
  } catch (err) {
    return res.status(400).send(`Delete Error: ${err}`);
  }
});

export default router;
