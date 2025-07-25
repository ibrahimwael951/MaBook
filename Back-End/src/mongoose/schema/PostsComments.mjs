import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  postId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PostComments = mongoose.model("PostComments", CommentsSchema);
