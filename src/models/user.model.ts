import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    currentIssuedBook: { type: mongoose.Types.ObjectId, ref: "book" },
  },
  { timestamps: true }
);

const user = model("user", userSchema);

export default user;
