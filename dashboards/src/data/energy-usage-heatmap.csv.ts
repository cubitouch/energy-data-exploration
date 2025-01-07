import { csvFormat } from "d3-dsv";
import dotenv from "dotenv";
import { fetchData } from "../utils/data_loader.js";
import assert from "node:assert";

dotenv.config();

const DSN = process.env.DATABASE_URL;
assert(!!DSN);

const QUERY = `
  SELECT
    day_of_week,
    hour,
    usage
  FROM analytics_fact.fact_energy_usage_over_week
  WHERE timestamp_month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
  ORDER BY 1,2
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
