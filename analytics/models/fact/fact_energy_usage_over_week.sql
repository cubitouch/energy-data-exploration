{{ config(materialized='table') }}

SELECT
    DATE_TRUNC('month', t) AS timestamp_month,
    EXTRACT(YEAR FROM t) AS year,
    EXTRACT(MONTH FROM t) AS month,
    EXTRACT(DOW FROM t) AS day_of_week,
    EXTRACT(HOUR FROM t) AS hour,
    AVG(actual) AS usage
FROM {{ ref('stg_energy_market_france') }}
GROUP BY 1, 2, 3, 4, 5
ORDER BY 1, 2, 3, 4, 5