import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  percentage: { type: Number, min: 0, max: 100, default: 0 },
  currentPage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const BooksSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  book: {
    BookLink: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    totalPages: { type: Number, default: 0 },
  },
  progress: { type: ProgressSchema, default: () => ({}) },
  rate: {
    mood: { type: String, default: "" },
    comment: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

export const myBooks = mongoose.model("myBooks", BooksSchema);
