import mongoose from "mongoose";
const PostSchema = new mongoose.Schema(
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
PostSchema.index({ createdAt: -1, _id: -1 });
export const UsersPosts = mongoose.model("UsersPosts", PostSchema);
