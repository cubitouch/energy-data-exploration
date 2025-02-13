export const getQuery = (days: number) => `
  SELECT
    DATE_TRUNC('day', timestamp_hour) as timestamp_date,

    SUM(usage) as usage,
    SUM(usage_estimated_d1) as usage_estimated_d1,
    SUM(usage_estimated_d) as usage_estimated_d,
    MIN(usage_min) as usage_min,
    MAX(usage_max) as usage_max,
    AVG(usage_average) as usage_average,

    SUM(co2_impact) as co2_impact,

    SUM(usage_renewable) as usage_renewable,
    SUM(usage_non_renewable) as usage_non_renewable,
    SUM(usage_green) as usage_green,
    SUM(usage_non_green) as usage_non_green,
    SUM(usage_clean) as usage_clean,
    SUM(usage_non_clean) as usage_non_clean,

    SUM(usage_fuel_oil) AS usage_fuel_oil,
    SUM(usage_coal) AS usage_coal,
    SUM(usage_gas) AS usage_gas,
    SUM(usage_nuclear) AS usage_nuclear,
    SUM(usage_wind) AS usage_wind,
    SUM(usage_solar) AS usage_solar,
    SUM(usage_hydropower) AS usage_hydropower,
    SUM(usage_pumped_storage) AS usage_pumped_storage,
    SUM(usage_bioenergy) AS usage_bioenergy,

    SUM(import_england) AS import_england,
    SUM(import_spain) AS import_spain,
    SUM(import_italy) AS import_italy,
    SUM(import_swiss) AS import_swiss,
    SUM(import_germany_belgium) AS import_germany_belgium
  FROM analytics_fact.fact_energy_usage_france
  WHERE timestamp_hour < CURRENT_DATE
  AND timestamp_hour > CURRENT_DATE - INTERVAL '${days} days'
  GROUP BY 1
  ORDER BY 1
`;
