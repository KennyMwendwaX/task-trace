import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

// const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;
