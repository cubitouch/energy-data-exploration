{{ config(materialized='table') }}

SELECT
    EXTRACT(YEAR FROM t) AS year,
    EXTRACT(MONTH FROM t) AS month,
    EXTRACT(DOW FROM t) AS day_of_week,
    EXTRACT(HOUR FROM t) AS hour,
    AVG(actual) AS usage
FROM {{ ref('stg_energy_market_france') }}
GROUP BY 1, 2, 3, 4
ORDER BY 1, 2, 3, 4