import mongoose, { model, Schema } from "mongoose";

const bookSchema = new Schema(
  {
    bookName: { type: String, required: true, unique: true },
    author: { type: String, default: "various" },
    category: { type: String, required: true },
    rent: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const book = model("book", bookSchema);

export default book;
