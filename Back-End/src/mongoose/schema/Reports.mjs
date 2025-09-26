import mongoose from "mongoose";

const ReportsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["post", "comment", "book", "user"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
ReportsSchema.index({ targetId: 1, reportedBy: 1 }, { unique: true });
export const Reports = mongoose.model("Reports", ReportsSchema);
