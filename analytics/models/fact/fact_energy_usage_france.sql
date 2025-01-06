{{ config(materialized='table') }}


SELECT
    date_trunc('hour', t) as timestamp_hour,
    SUM(actual) as usage,
    SUM(renewable) as usage_renewable,
    SUM(non_renewable) as usage_non_renewable
FROM analytics_staging.stg_energy_market_france
WHERE actual IS NOT NULL
GROUP BY 1
ORDER BY 1