import express from "express";
import dotenv from "dotenv";
import connect from "./db.js";
import userRoute from "./routes/user.route.js";
import bookRoute from "./routes/book.route.js";
import transactionRoute from "./routes/transaction.route.js";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 8080;

const client = process.env.CLIENT;
const app = express();
app.use(express.json());
app.use(cors({ origin: client }));
connect();
app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/transaction", transactionRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
