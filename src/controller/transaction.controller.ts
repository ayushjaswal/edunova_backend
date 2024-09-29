import { Request, Response } from "express";
import book from "../models/book.model.js";
import transaction from "../models/transaction.model.js";
import user from "../models/user.model.js";
import mongoose from "mongoose";
import { userType } from "../types.js";

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await transaction.find().populate(["issuer", "book"]);
    if (transactions) {
      return res.status(200).json(transactions);
    } else {
      return res.status(404).json({ message: "No transactions found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { issuer, bookName, issueDate } = req.body;
    const bookAvailabe = await book.findOne({
      bookName: { $regex: bookName, $options: "i" },
    });
    if (!bookAvailabe || !bookAvailabe.available) {
      return res.status(400).json({ message: "Book currently not available" });
    }
    let userDb;
    if (mongoose.isValidObjectId(issuer)) {
      userDb = await user.findById(issuer);
    } else {
      userDb = await user.findOne({ name: issuer });
    }
    if (userDb.currentIssuedBook) {
      return res
        .status(400)
        .json({ message: "User already has an issued book" });
    }
    userDb.currentIssuedBook = bookAvailabe._id;
    await userDb.save();
    bookAvailabe.available = false;
    await bookAvailabe.save();
    const newTransaction = await transaction.create({
      book: bookAvailabe._id,
      issuer: userDb._id,
      issueDate,
    });
    if (newTransaction) {
      return res
        .status(200)
        .json({ success: true, transaction: newTransaction });
    } else {
      return res.status(500).json({ message: "Failed to create transaction" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const closeTransaction = async (req: Request, res: Response) => {
  try {
    const { returnDate, bookName, issuer } = req.body;
    const bookAvailabe = await book.findOne({
      bookName: { $regex: bookName, $options: "i" },
    });
    let userDb: userType;
    if (mongoose.isValidObjectId(issuer)) {
      userDb = await user.findById(issuer);
    } else {
      userDb = await user.findOne({ name: issuer });
    }
    const allTransactionDb = await transaction.find({
      book: bookAvailabe._id,
      issuer: userDb._id,
    });

    const transactionDb = allTransactionDb.filter(
      (transaction) => !transaction.returnDate
    );
    if (!transactionDb) {
      return res.status(404).json({ message: "No matching transaction found" });
    }

    const retDate = new Date(returnDate);
    const issueDate = new Date(transactionDb[0].issueDate);
    const calculateDays =
      (retDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24);
    const calculatedRent = calculateDays * bookAvailabe.rent;

    console.log({ rent: calculatedRent, retDate, issueDate });
    await user.updateOne(
      { _id: userDb._id },
      { $unset: { currentIssuedBook: "" } }
    );
    bookAvailabe.available = true;
    await bookAvailabe.save();
    transactionDb[0].returnDate = retDate;
    transactionDb[0].totalFee = calculatedRent;
    await transactionDb[0].save();

    return res.status(200).json(transactionDb);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getBookInfo = async (req: Request, res: Response) => {
  try {
    const { bookName } = req.params;
    const bookDb = await book.findOne({
      bookName: { $regex: bookName, $options: "i" },
    });
    if (!bookDb) {
      return res.status(404).json({ message: "Book not found" });
    }
    let bookAvailable = bookDb.available;
    const transactionDb = await transaction
      .find({ book: bookDb._id })
      .populate("issuer")
      .sort({ issueDate: 1 });
    const userWithBook = transactionDb.map((value) => value.issuer);
    if (bookAvailable) {
      return res
        .status(200)
        .json({ currentStatus: "available", users: userWithBook });
    } else {
      const currentIssuer = transactionDb.filter(
        (value) => !value.returnDate
      )[0].issuer;
      return res.status(200).json({
        currentIssuer: currentIssuer,
        user: userWithBook,
        currentStatus: "not available",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const getBookTotalRevenue = async (req: Request, res: Response) => {
  try {
    const { bookName } = req.params;
    const bookDb = await book.findOne({
      bookName: { $regex: bookName, $options: "i" },
    });
    if (!bookDb) {
      return res.status(404).json({ message: "Book not found" });
    }
    const transactionDb = await transaction.find({ book: bookDb._id });
    const totalRevenueArray = transactionDb.map(
      (transaction) => transaction.totalFee
    );
    console.log(totalRevenueArray);
    let totalRevenue = 0;
    for (let i = 0; i < totalRevenueArray.length; i++) {
      totalRevenue += totalRevenueArray[i];
    }
    console.log(totalRevenue);
    return res.status(200).json({ totalRevenue });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const getUserBook = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    let userDb;
    if (mongoose.isValidObjectId(name)) {
      userDb = await user.findById(name);
    } else {
      userDb = await user.findOne({ name: { $regex: name, $options: "i" } });
    }
    const transactionDb = await transaction
      .find({ issuer: userDb._id })
      .populate("book");
    const booksIssued = [
      ...new Set(transactionDb.map((transaction) => transaction.book)),
    ];
    if (transactionDb) {
      return res.status(200).json(booksIssued);
    } else {
      return res.status(400).json({ message: "No transactions found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const getBookByDateRange = async (req: Request, res: Response) => {
  try {
    const { minDate, maxDate } = req.query;
    console.log({ minDate, maxDate });
    const allTransactionDb = await transaction
      .find({ issueDate: { $gte: minDate, $lte: maxDate } })
      .populate(["issuer", "book"]);
    const transactionDb = allTransactionDb.map((value) => ({
      book: value.book,
      issuer: value.issuer,
    }));
    if (transactionDb) {
      return res.status(200).json(transactionDb);
    } else {
      return res.status(404).json({ message: "No transactions found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
