import { Request, Response } from "express";
import book from "../models/book.model.js";

export const findBooksWithKeyword = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const books = await book.find({
      bookName: { $regex: query, $options: "i" },
    });
    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};

export const findBooksWithRent = async (req: Request, res: Response) => {
  try {
    const { minimumRent, maximumRent } = req.query;
    console.log({ maximumRent, minimumRent });

    const books = await book.find({
      rent: { $lte: Number(maximumRent), $gte: Number(minimumRent) },
    });
    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};

export const findBooksWithValues = async (req: Request, res: Response) => {
  try {
    const { minimumRent, maximumRent, keyword, category } = req.query;
    console.log({ maximumRent, minimumRent });

    const books = await book.find({
      bookName: { $regex: keyword, $options: 'i'  },
      category: { $regex: category, $options: 'i' },
      rent: { $lte: Number(maximumRent), $gte: Number(minimumRent) },
    });
    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
};

//HELPER FUNCTIONS
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await book.find();
    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const { bookName, category, rent, author } = req.body;
    const newBook = await book.create({ bookName, category, rent, author });
    if (newBook) {
      return res.status(200).json({ success: true, book: newBook });
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
