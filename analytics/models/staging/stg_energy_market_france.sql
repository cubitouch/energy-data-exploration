{{ config(materialized='table') }}

WITH typed as (
    SELECT
        TO_TIMESTAMP(date || ' ' || heures, 'YYYY-MM-DD HH24:MI') AS t,
        CASE
            WHEN consommation IN ('', 'ND') THEN NULL
            ELSE consommation::NUMERIC
        END AS actual,
        CASE
            WHEN pr_vision_j_1 IN ('', 'ND') THEN NULL
            ELSE pr_vision_j_1::NUMERIC
        END AS estimated_d1,
        CASE
            WHEN pr_vision_j IN ('', 'ND') THEN NULL
            ELSE pr_vision_j::NUMERIC
        END AS estimated_d,

        CASE
            WHEN taux_de_co2 IN ('', 'ND') THEN NULL
            ELSE taux_de_co2::NUMERIC
        END AS co2_ratio,

        CASE
            WHEN fioul IN ('', 'ND') THEN NULL
            ELSE fioul::NUMERIC
        END AS fuel_oil,
        CASE
            WHEN charbon IN ('', 'ND') THEN NULL
            ELSE charbon::NUMERIC
        END AS coal,
        CASE
            WHEN gaz IN ('', 'ND') THEN NULL
            ELSE gaz::NUMERIC
        END AS gas,
        CASE
            WHEN nucl_aire IN ('', 'ND') THEN NULL
            ELSE nucl_aire::NUMERIC
        END AS nuclear,
        CASE
            WHEN eolien IN ('', 'ND') THEN NULL
            ELSE eolien::NUMERIC
        END AS wind,
        CASE
            WHEN solaire IN ('', 'ND') THEN NULL
            ELSE solaire::NUMERIC
        END AS solar,
        CASE
            WHEN hydraulique IN ('', 'ND') THEN NULL
            ELSE hydraulique::NUMERIC
        END AS hydropower,
        CASE
            WHEN pompage IN ('', 'ND') THEN NULL
            ELSE pompage::NUMERIC
        END AS pumped_storage,
        CASE
            WHEN bio_nergies IN ('', 'ND') THEN NULL
            ELSE bio_nergies::NUMERIC
        END AS bioenergy
    FROM {{ source('raw_energy', 'raw_energy_market_france') }}
)

SELECT
    t,

    actual,
    estimated_d1,
    estimated_d,

    co2_ratio,

    fuel_oil,
    coal,
    gas,
    nuclear,
    wind,
    solar,
    hydropower,
    pumped_storage,
    bioenergy,
    -- TODO: move this to intermediate model
    wind + solar + hydropower + pumped_storage + bioenergy as renewable,
    fuel_oil + coal + gas + nuclear as non_renewable
FROM typed
ORDER BY 1