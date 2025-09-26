import { Router } from "express";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { CheckEmail, CheckUsername } from "../validator/UserAuth.mjs";
const route = Router();

route.post(
  "/api/check/username",
  checkSchema(CheckUsername),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(404).send(result.array());

    const data = matchedData(req);

    try {
      const findUsername = await user.findOne({ username: data.username });
      if (findUsername)
        return res.status(400).send({ msg: "Use another username" });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send({ msg: "Server error", error: err.message });
    }
  }
);
route.post("/api/check/email", checkSchema(CheckEmail), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(404).send(result.array());
  const data = matchedData(req);
  try {
    const findUsername = await user.findOne({ email: data.email });
    if (findUsername) return res.status(400).send({ msg: "Use another email" });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ msg: "Server error", error: err.message });
  }
});

export default route;
