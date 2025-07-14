import { sql } from "../config/db.js";
const {sql} = require("../config/db.js")

const getTransactionsByUserid = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
      `;

    res
      .status(200)
      .json({ data: transactions, message: "Success get transactions!" });
  } catch (error) {
    console.log("Error getting the transactions: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getSummaryTransactionByUserid = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
      `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND category = 'income'
      `;
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND category = 'expense'
      `;

    const data = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };
    res.status(200).json({
      data,
      message: "Success get transaction summary!",
    });
  } catch (error) {
    console.log("Error getting the transaction summary: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category) 
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
      `;

    res.status(201).json({
      data: transaction[0],
      message: "Transaction created successfully!",
    });
  } catch (error) {
    console.log("Error creating the transactions: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (error) {
    console.log("Error deleting the transaction: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

module.exports = {
  getTransactionsByUserid,
  getSummaryTransactionByUserid,
  createTransaction,
  deleteTransaction,
};
