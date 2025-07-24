import passport from "passport";
import { Strategy } from "passport-local";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { ComparePassword } from "../util/Hashing.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await user.findById(id);
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      usernameField: "usernameOrEmail",
      passwordField: "password",
    },
    async (usernameOrEmail, password, done) => {
      try {
        const findUser = await user.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!findUser) throw new Error("user not found");
        if (!ComparePassword(password, findUser.password))
          throw new Error("Invalid Credentials");
        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
