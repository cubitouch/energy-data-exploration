import { safeFetchData } from "../utils/data_loader.js";

const QUERY = `
  SELECT
    DATE_TRUNC('day', timestamp_hour) as timestamp_date,
    SUM(usage) as usage
  FROM analytics_fact.fact_energy_usage_france
  WHERE timestamp_hour > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY 1
  ORDER BY 1
`;

(async () => safeFetchData(QUERY))();
