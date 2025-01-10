import { csvFormat } from "d3-dsv";
import dotenv from "dotenv";
import { fetchData } from "../utils/data_loader.js";
import assert from "node:assert";

dotenv.config();

const DSN = process.env.DATABASE_URL;
assert(!!DSN);

const QUERY = `
  SELECT
    DATE_TRUNC('day', t) as timestamp_date,
    COUNT(*) as count
  FROM analytics_staging.stg_energy_market_france
  GROUP BY 1
  ORDER BY 1
`;

(async () => {
  try {
    const data = await fetchData(DSN, QUERY);
    process.stdout.write(csvFormat(data));
  } catch (error) {
    console.error("Error fetching data:", error);
    process.exit(1);
  }
})();
