import mongoose from "mongoose";
const Post = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      public_id: String,
      width: Number,
      height: Number,
      resource_type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
Post.index({ createdAt: -1, _id: -1 });
export const Posts = mongoose.model("Posts", Post);
