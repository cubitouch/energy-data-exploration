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
            WHEN fioul IN ('', 'ND') THEN 0
            ELSE fioul::NUMERIC
        END AS fuel_oil,
        CASE
            WHEN charbon IN ('', 'ND') THEN 0
            ELSE charbon::NUMERIC
        END AS coal,
        CASE
            WHEN gaz IN ('', 'ND') THEN 0
            ELSE gaz::NUMERIC
        END AS gas,
        CASE
            WHEN nucl_aire IN ('', 'ND') THEN 0
            ELSE nucl_aire::NUMERIC
        END AS nuclear,
        CASE
            WHEN eolien IN ('', 'ND') THEN 0
            ELSE eolien::NUMERIC
        END AS wind,
        CASE
            WHEN solaire IN ('', 'ND') THEN 0
            ELSE solaire::NUMERIC
        END AS solar,
        CASE
            WHEN hydraulique IN ('', 'ND') THEN 0
            ELSE hydraulique::NUMERIC
        END AS hydropower,
        CASE
            WHEN pompage IN ('', 'ND') THEN 0
            ELSE pompage::NUMERIC
        END AS pumped_storage,
        CASE
            WHEN bio_nergies IN ('', 'ND') THEN 0
            ELSE bio_nergies::NUMERIC
        END AS bioenergy,

        CASE
            WHEN ech_comm_angleterre IN ('', 'ND') THEN 0
            ELSE ech_comm_angleterre::NUMERIC
        END AS import_england,
        CASE
            WHEN ech_comm_espagne IN ('', 'ND') THEN 0
            ELSE ech_comm_espagne::NUMERIC
        END AS import_spain,
        CASE
            WHEN ech_comm_italie IN ('', 'ND') THEN 0
            ELSE ech_comm_italie::NUMERIC
        END AS import_italy,
        CASE
            WHEN ech_comm_suisse IN ('', 'ND') THEN 0
            ELSE ech_comm_suisse::NUMERIC
        END AS import_swiss,        
        CASE
            WHEN ech_comm_allemagne_belgique IN ('', 'ND') THEN 0
            ELSE ech_comm_allemagne_belgique::NUMERIC
        END AS import_germany_belgium
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
    fuel_oil + coal + gas + nuclear as non_renewable,

    import_england,
    import_spain,
    import_italy,
    import_swiss,
    import_germany_belgium
FROM typed
ORDER BY 1