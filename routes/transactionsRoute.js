import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryTransactionByUserid,
  getTransactionsByUserid,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserid);
router.get("/summary/:userId", getSummaryTransactionByUserid);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
