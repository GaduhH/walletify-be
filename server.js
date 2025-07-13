import express from "express";
import "dotenv/config";
import { sql } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import serverless from "serverless-http";

import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();

// middlewares
app.use(rateLimiter);
app.use(express.json());

async function initDB() {
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
  } catch (error) {
    console.log("Error initializing database: ", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

app.use("/api/transactions", transactionsRoute);

await initDB();
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
  });
  // initDB().then(() => {
  // });

  return;
}
export const handler = serverless(app);
