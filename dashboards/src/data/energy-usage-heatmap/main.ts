export const getQuery = (days: number) => `
  SELECT
    EXTRACT(DOW FROM timestamp_hour) AS day_of_week,
    EXTRACT(HOUR FROM timestamp_hour) AS hour,
    AVG(usage) AS usage,
    AVG(co2_impact) AS co2_impact
  FROM analytics_fact.fact_energy_usage_france
  WHERE timestamp_hour < CURRENT_DATE
  AND timestamp_hour >= CURRENT_DATE - INTERVAL '${days} days'
  GROUP BY 1, 2
  ORDER BY 1, 2
`;
