import { Router } from "express";
import { UserDataSchema } from "../util/ValidationSchema.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { hashPassword } from "../util/Hashing.mjs";
import passport from "passport";
import { user } from "../mongoose/schema/UserAuth.mjs";

const router = Router();

router.post("/api/User", checkSchema(UserDataSchema), async (req, res) => {
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
    res.status(400).send(`Errors: ${err}`);m   
  }
});

router.post("/api/user/auth", passport.authenticate("local") , (req,res)=>{
  res.sendStatus(200)
})

router.get("/api/user/status" ,(req,res)=>{
  return req.user ? res.send(req.user) : res.status(401).send({msg:"Not Authentication"})
})

export default router;
