import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Connect to the database using Neon
export const sql = neon(process.env.DATABASE_URL);
