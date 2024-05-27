import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      max: 25,
    },
    last_name: {
      type: String,
      required: true,
      max: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 25,
    },
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);
