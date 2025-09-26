import { Router } from "express";
import { UpDateUserData, UserLoggingIn } from "../validator/UserAuth.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { hashPassword } from "../util/Hashing.mjs";
import passport from "passport";
import { user } from "../mongoose/schema/UserAuth.mjs";

const router = Router();

router.post(
  "/api/auth/register",
  checkSchema(UserLoggingIn),
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const data = matchedData(req);
    data.password = hashPassword(data.password);

    const newUser = new user({
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    });

    try {
      const savedUser = await newUser.save();

      req.login(savedUser, (err) => {
        if (err) return next(err);

        const UserData = savedUser.toObject();

        delete UserData.password;
        delete UserData.__v;
        
        const userToSend = { ...UserData };
        if (userToSend.avatar.url) {
          userToSend.avatar = userToSend.avatar.url;
        }

        return res.status(201).json({
          user: userToSend,
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: "Registration failed",
        error: err.message,
      });
    }
  }
);

router.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid credentials",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Login failed",
          error: err.message,
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
});

router.patch(
  "/api/auth/update",
  passport.authenticate("session"),
  checkSchema(UpDateUserData),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }

      const data = matchedData(req);

      if (data.password) {
        return res.status(400).json({
          error: "Password cannot be updated here",
        });
      }

      const updateFields = {
        ...data,
      };

      if (data.firstName || data.lastName) {
        updateFields.fullName = `${data.firstName || req.user.firstName} ${
          data.lastName || req.user.lastName
        }`;
      }

      const updateUser = await user.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updateUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const safeUser = updateUser.toObject();
      delete safeUser.password;
      delete safeUser.__v;

      return res.status(200).json({ user: safeUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Update Error",
        error: err.message,
      });
    }
  }
);

router.get(
  "/api/auth/status",
  passport.authenticate("session"),
  async (req, res) => {
    const userDoc = await user.findById(req.user._id).lean();
    delete userDoc.password;
    delete userDoc.__v;

    if (!userDoc) {
      throw new Error("User not found");
    }
    const userSaveData = { ...userDoc };

    delete userSaveData.password;
    delete userSaveData.__v;

    if (userSaveData.avatar.url) {
      userSaveData.avatar = userSaveData.avatar.url;
    }

    return userSaveData
      ? res.status(200).json({ user: userSaveData })
      : res.status(401).json({ message: "Not Authenticated" });
  }
);

router.post("/api/auth/logout", (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

router.delete(
  "/api/auth/delete",
  passport.authenticate("session"),
  async (req, res, next) => {
    try {
      const { user } = req;

      const deletedUser = await user.findByIdAndDelete(user._id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      req.logout((err) => {
        if (err) {
          return next(err);
        }

        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            return res
              .status(500)
              .json({ message: "Failed to destroy session" });
          }

          res.clearCookie("connect.sid");
          return res
            .status(200)
            .json({ message: "Account deleted successfully" });
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: "Delete Error",
        error: err.message,
      });
    }
  }
);

export default router;
