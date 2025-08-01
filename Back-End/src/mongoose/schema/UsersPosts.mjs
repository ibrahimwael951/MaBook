import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const UsersPosts = mongoose.model("UsersPosts", PostSchema);
