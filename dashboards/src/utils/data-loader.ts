import pkg from "pg";
import dotenv from "dotenv";
import assert from "node:assert";
import { csvFormat } from "d3-dsv";

dotenv.config();

const DSN = process.env.DATABASE_URL;
assert(!!DSN);
const { Client } = pkg;

async function fetchData(dsn, query) {
  const client = new Client({
    connectionString: dsn,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();

  try {
    const res = await client.query(query);
    return res.rows;
  } finally {
    await client.end();
  }
}

export async function safeFetchData(query) {
  try {
    const data = await fetchData(DSN, query);
    process.stdout.write(csvFormat(data));
  } catch (error) {
    console.error("Error fetching data:", error);
    process.exit(1);
  }
}
