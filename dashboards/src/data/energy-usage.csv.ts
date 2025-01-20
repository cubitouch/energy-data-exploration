import { safeFetchData } from "../utils/data_loader.js";

const QUERY = `
  SELECT
    DATE_TRUNC('day', timestamp_hour) as timestamp_date,
    SUM(usage) as usage,
    MIN(usage_min) as usage_min,
    MAX(usage_max) as usage_max,
    AVG(usage_average) as usage_average,
    SUM(co2_impact) as co2_impact
  FROM analytics_fact.fact_energy_usage_france
  WHERE timestamp_hour > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY 1
  ORDER BY 1
`;

(async () => safeFetchData(QUERY))();
