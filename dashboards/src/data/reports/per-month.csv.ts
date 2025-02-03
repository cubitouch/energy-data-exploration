import { safeFetchData } from "../../utils/data-loader.js";

const QUERY = `
  SELECT
    DATE_TRUNC('month', report_date) as report_month,
    COUNT(*) as count
  FROM analytics_staging.stg_energy_reports
  GROUP BY 1
  ORDER BY 1
`;

(async () => safeFetchData(QUERY))();
