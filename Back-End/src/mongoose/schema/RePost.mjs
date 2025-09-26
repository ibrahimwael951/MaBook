import mongoose from "mongoose";

const RePostSchema = new mongoose.Schema(
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
    text: {
      type: String,
      required: true,
      trim: true,
    },
    feelings: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RePostSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const RePost = mongoose.model("RePost", RePostSchema);
