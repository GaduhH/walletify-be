"use strict";
import express from "express";
import "dotenv/config";
import { sql } from "../config/db.js";
import rateLimiter from "..//middlewares/rateLimiter.js";
import serverless from "serverless-http";
import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionsRoute);

// Inisialisasi database
let dbInitialized = false;
async function initDB() {
  if (!dbInitialized) {
    try {
      await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`;
      console.log("Database initialized");
      dbInitialized = true;
    } catch (error) {
      console.log("Error initializing database:", error);
    }
  }
}

async function main() {
  await initDB();
  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running locally at http://localhost:${PORT}`);
    });
  }
}

main();
export default serverless(app);
