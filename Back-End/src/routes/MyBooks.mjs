import { myBooks } from "../mongoose/schema/Books.mjs";
import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { MyBookSchema } from "../validator/Books.mjs";
import passport from "passport";

const router = Router();

router.get(
  "/api/myBooks",
  passport.authenticate("session"),

  async (req, res) => {
    try {
      const books = await myBooks
        .find({ userId: req.user._id })
        .sort({ createdAt: -1 });
      if (!books) return res.status(401).json({ message: "no books found" });
      res.status(200).send(books);
    } catch (err) {
      res.status(500).json({
        message: "server error",
        details: err.message,
      });
    }
  }
);
router.post(
  "/api/myBooks",
  passport.authenticate("session"),
  checkSchema(MyBookSchema),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          error: result.array(),
        });
      }
      const data = matchedData(req);
      const existed = await myBooks.findOne({
        userId: req.user._id,
        "book.BookLink": data.book.BookLink,
      });
      if (existed)
        return res
          .status(401)
          .json({ message: "you are already saved this book" });
      const Book = {
        userId: req.user._id,
        ...data,
      };
      const newBook = new myBooks(Book);

      await newBook.save();
      res.status(200).json({ userId: req.user._id, ...data });
    } catch (err) {
      res.status(500).json({ message: "server Error", details: err.message });
    }
  }
);

router.patch(
  "/api/myBooks/:id",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const book = await myBooks.findOne({
        userId: req.user._id,
        "book.BookLink": id,
      });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.userId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update this book" });
      }

      const { progress, rate } = req.body;

      if (progress) {
        if (typeof progress.percentage !== "undefined") {
          book.progress.percentage = progress.percentage;
        }
        if (typeof progress.currentPage !== "undefined") {
          book.progress.currentPage = progress.currentPage;
        }
        if (typeof rate.mood !== "undefined") {
          book.rate.mood = rate.mood;
        }
        if (typeof rate.comment !== "undefined") {
          book.rate.comment = rate.comment;
        }
        book.progress.lastUpdated = new Date();
      }

      await book.save();

      return res
        .status(200)
        .json({ message: "Book updated successfully", book });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error", details: err.message });
    }
  }
);

router.delete(
  "/api/myBooks/:id",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const book = await myBooks.findOne({
        userId: req.user._id,
        "book.BookLink": id,
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      await myBooks.deleteOne({
        userId: req.user._id,
        "book.BookLink": id,
      });

      res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", details: err.message });
    }
  }
);

router.get(
  "/api/myBooks/:id/isSaved",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const book = await myBooks.findOne({
        userId: req.user._id,
        "book.BookLink": id,
      });
      if (book)
        return res
          .status(200)
          .json({ message: "you are already saved this book " });
      res.status(400).json({ message: "not found book in your shelf" });
    } catch (err) {
      res.status(500).json({ message: "server error", details: err.message });
    }
  }
);
router.get(
  "/api/myBooks/:id",
  passport.authenticate("session"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const book = await myBooks.findOne({
        userId: req.user._id,
        "book.BookLink": id,
      });
      if (book) return res.status(200).json(book);
      res.status(400).json({ message: "not found book in your shelf" });
    } catch (err) {
      res.status(500).json({ message: "server error", details: err.message });
    }
  }
);
export default router;
