import mongoose from "mongoose";

const LikesSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Likes = mongoose.model("Likes", LikesSchema);
