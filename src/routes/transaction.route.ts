import express from "express";
import {
  createTransaction,
  getAllTransactions,
  closeTransaction,
  getBookInfo,
  getBookTotalRevenue,
  getUserBook,
  getBookByDateRange,
} from "../controller/transaction.controller.js";
const router = express.Router();

router.get("/", getAllTransactions);

router.post("/create-transaction", createTransaction);
router.post("/close-transaction", closeTransaction);

router.get("/get-book-by-date-range", getBookByDateRange);

router.get("/:bookName", getBookInfo);

router.get("/get-revenue/:bookName", getBookTotalRevenue);
router.get("/get-user-book/:name", getUserBook);
export default router;
