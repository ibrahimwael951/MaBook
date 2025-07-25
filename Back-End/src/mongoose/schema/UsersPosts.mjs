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
});
export const UsersPosts = mongoose.model("UsersPosts", PostSchema);
