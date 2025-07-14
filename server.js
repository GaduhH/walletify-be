// server.js
import express from "express";
import "dotenv/config";
import { sql } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"

const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionsRoute);

// Inisialisasi database (hanya sekali)
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
      console.error("Error initializing database:", error);
    }
  }
}

// Jalankan server hanya saat local development
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5001;
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running locally at http://localhost:${PORT}`);
    });
  });
}

export default app;
