import { Router } from "express";
import { UpDateUserData, UserLoggingIn } from "../util/ValidationSchema.mjs";
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

        const userToSend = savedUser.toObject();

        delete userToSend.password;
        delete userToSend.__v;

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
        return res.status(400).json({
          error: result.array(),
        });
      }
      const data = matchedData(req);
      if (data.password) {
        return res.status(400).json({
          error: "password cannot be updated here",
        });
      }
      const { UserData } = req;
      const updateUser = await user.findByIdAndUpdate(
        UserData._id,
        { $set: data, fullName: `${data.firstName} ${data.lastName}` },
        { new: true, runValidators: true }
      );

      if (!updateUser) {
        return res.status(400).json({
          error: "User not Found",
        });
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

router.get("/api/auth/status", passport.authenticate("session"), (req, res) => {
  return req.user
    ? res.status(200).json({ user: req.user })
    : res.status(401).json({ message: "Not Authenticated" });
});

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
      const { UserData } = req;

      const deletedUser = await user.findByIdAndDelete(UserData._id);
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
