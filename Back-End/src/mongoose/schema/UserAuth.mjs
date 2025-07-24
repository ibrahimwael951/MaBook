import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    required: true,
    type: String,
    enum: ["male", "female"],
    lowercase: true,
    trim: true,
  },
});
export const user = mongoose.model("user", UserSchema);
