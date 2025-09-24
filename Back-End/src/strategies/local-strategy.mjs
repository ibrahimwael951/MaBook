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
    if (!findUser) return done(null, false, { message: "User not found" });

    const userWithoutPassword = findUser.toObject();
    delete userWithoutPassword.password;

    done(null, userWithoutPassword);
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

        if (!findUser) {
          return done(null, false, { message: "User not found" });
        }

        const isMatched = await ComparePassword(password, findUser.password);
        if (!isMatched) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const SaveData = findUser.toObject();
        delete SaveData.password;
        delete SaveData.__v;

        const UserDataToSend = { ...SaveData };
        if (UserDataToSend.avatar.url) {
          UserDataToSend.avatar = UserDataToSend.avatar.url;
        }

        return done(null, UserDataToSend);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
