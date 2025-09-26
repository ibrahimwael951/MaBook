import mongoose from "mongoose";

const SavePostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SavePostSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const SavePost = mongoose.model("SavePost", SavePostSchema);
