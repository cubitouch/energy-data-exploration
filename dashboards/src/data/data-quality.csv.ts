import { safeFetchData } from "../utils/data-loader.js";

const QUERY = `
  SELECT
    DATE_TRUNC('day', t) as timestamp_date,
    SUM(CASE WHEN actual > 0 THEN 1 ELSE 0 END) as count
  FROM analytics_staging.stg_energy_market_france
  GROUP BY 1
  ORDER BY 1
`;

(async () => safeFetchData(QUERY))();
