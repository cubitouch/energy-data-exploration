import { safeFetchData } from "../../utils/data-loader.js";

const QUERY = `
  WITH total_per_period AS (
    SELECT
      construction_period,
      COUNT(*) as total
    FROM analytics_staging.stg_energy_reports
    WHERE building_position = 'RDC'
    GROUP BY 1
  )

  SELECT
    r.construction_period,
    r.dpe_label,
    t.total,
    COUNT(r.*)::NUMERIC / t.total::NUMERIC AS ratio
  FROM analytics_staging.stg_energy_reports r
  INNER JOIN total_per_period t
    ON t.construction_period = r.construction_period
  WHERE building_position = 'RDC'
  GROUP BY 1,2,3
`;

(async () => safeFetchData(QUERY))();
