import { safeFetchData } from "../../utils/data-loader.js";

const QUERY = `
  SELECT
    CASE WHEN building_position = 'RDC' THEN 1 ELSE 0 END AS is_ground_floor,
    SUM(CASE WHEN dpe_label IN ('A','B','C') THEN 1 ELSE 0 END) AS abc_rating_group,
    SUM(CASE WHEN dpe_label IN ('A','B','C') THEN 0 ELSE 1 END) AS others_rating_group
  FROM analytics_staging.stg_energy_reports
  GROUP BY 1
  ORDER BY 2 DESC
`;

(async () => safeFetchData(QUERY))();
