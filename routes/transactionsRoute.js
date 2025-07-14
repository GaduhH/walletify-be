const express = require("express");
const {
  createTransaction,
  deleteTransaction,
  getSummaryTransactionByUserid,
  getTransactionsByUserid,
} = require("../controllers/transactionsController.js");

const router = express.Router();

router.get("/summary/:userId", getSummaryTransactionByUserid);
router.get("/:userId", getTransactionsByUserid);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
