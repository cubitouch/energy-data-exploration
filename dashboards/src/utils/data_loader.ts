import pkg from "pg";
const { Client } = pkg;

export async function fetchData(dsn, query) {
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
