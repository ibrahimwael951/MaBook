import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  fullName: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  avatar: {
    url: String,
    public_id: String,
    width: Number,
    height: Number,
    resource_type: String,
  },
  gender: {
    required: true,
    type: String,
    enum: ["male", "female"],
    lowercase: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});
export const user = mongoose.model("user", UserSchema);
