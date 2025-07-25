import passport from "passport";
import { Strategy } from "passport-local";
import { user } from "../mongoose/schema/UserAuth.mjs";
import { ComparePassword } from "../util/Hashing.mjs";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await user.findById(id);
    if (!findUser) throw new Error("user not found");

    const saveUserData = findUser.toObject();
    delete saveUserData.password;

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

        const isMatched = ComparePassword(password, findUser.password);
        if (!isMatched) throw new Error("Invalid Credentials");

        const saveUserData = findUser.toObject();
        delete saveUserData.password;

        done(null, saveUserData);

      } catch (err) {
        done(err, null);
      }
    }
  )
);
