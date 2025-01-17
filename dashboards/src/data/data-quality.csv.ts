import { safeFetchData } from "../utils/data_loader.js";

const QUERY = `
  SELECT
    DATE_TRUNC('day', t) as timestamp_date,
    COUNT(*) as count
  FROM analytics_staging.stg_energy_market_france
  GROUP BY 1
  ORDER BY 1
`;

(async () => safeFetchData(QUERY))();