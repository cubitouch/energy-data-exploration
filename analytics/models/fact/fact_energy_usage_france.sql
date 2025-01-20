{{ config(materialized='table') }}

SELECT
    date_trunc('hour', t) AS timestamp_hour,

    SUM(actual) AS usage,
    MIN(actual) AS usage_min,
    MAX(actual) AS usage_max,
    AVG(actual) AS usage_average,

    SUM(co2_ratio * actual * 1000) AS co2_impact,

    SUM(renewable) AS usage_renewable,
    SUM(non_renewable) AS usage_non_renewable,

    SUM(fuel_oil) AS usage_fuel_oil,
    SUM(coal) AS usage_coal,
    SUM(gas) AS usage_gas,
    SUM(nuclear) AS usage_nuclear,
    SUM(wind) AS usage_wind,
    SUM(solar) AS usage_solar,
    SUM(hydropower) AS usage_hydropower,
    SUM(pumped_storage) AS usage_pumped_storage,
    SUM(bioenergy) AS usage_bioenergy
FROM {{ ref('stg_energy_market_france') }}
WHERE actual IS NOT NULL
GROUP BY 1
ORDER BY 1