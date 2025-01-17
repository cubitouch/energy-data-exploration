import { safeFetchData } from "../utils/data_loader.js";

const QUERY = `
  SELECT
    day_of_week,
    hour,
    usage
  FROM analytics_fact.fact_energy_usage_over_week
  WHERE timestamp_month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
  ORDER BY 1,2
`;

(async () => safeFetchData(QUERY))();
