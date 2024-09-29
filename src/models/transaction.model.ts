import mongoose, { model, Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    issuer: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    issueDate: { type: Date, required: true },
    book: { type: mongoose.Types.ObjectId, required: true, ref: "book" },
    returnDate: { type: Date },
    totalFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const transaction = model("transaction", transactionSchema);

export default transaction;
