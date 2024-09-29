import express from "express";
import {findBooksWithValues, 
  addBook,
  findBooksWithKeyword,
  findBooksWithRent,
  getAllBooks,
} from "../controller/book.controller.js";
const router = express.Router();

router.get("/", getAllBooks);

//Helper function to add book
router.post("/add-book", addBook);


// Call using /find-books/<keyword>
//Input: keyword or book title
//Output: Books with title containing the string
router.get("/find-books/:query", findBooksWithKeyword);

// Call using /find-books?minimumRent=<amount>&maximumRent=<amount>
//Input: minimumRent: Number, maximumRent: Number
//Output: Books with rent in that range
router.get("/find-books", findBooksWithRent);

// Call using /find-books?minimumRent=<amount>&maximumRent=<amount>&category=<category>&keyword=<keyword>
//Input: minimumRent: Number, maximumRent: Number, Category: string, Keyword: string
//Output: Books with matching parameters
router.get("/search", findBooksWithValues);
export default router;
