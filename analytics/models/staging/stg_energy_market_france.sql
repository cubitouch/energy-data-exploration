{{ config(materialized='table') }}

WITH typed as (
    SELECT
        TO_TIMESTAMP(date || ' ' || heures, 'YYYY-MM-DD HH24:MI') AS t,
        consommation::NUMERIC AS actual,
        CASE
            WHEN pr_vision_j_1 IN ('', 'ND') THEN NULL
            ELSE pr_vision_j_1::NUMERIC
        END AS estimated_d1,
        pr_vision_j::NUMERIC AS estimated_d,

        taux_de_co2::NUMERIC AS co2_ratio,

        fioul::NUMERIC AS fuel_oil,
        charbon::NUMERIC AS coal,
        gaz::NUMERIC AS gas,
        nucl_aire::NUMERIC AS nuclear,
        eolien::NUMERIC AS wind,
        solaire::NUMERIC AS solar,
        hydraulique::NUMERIC AS hydropower,
        pompage::NUMERIC AS pumped_storage,
        bio_nergies::NUMERIC AS bioenergy,

        ech_comm_angleterre::NUMERIC AS import_england,
        ech_comm_espagne::NUMERIC AS import_spain,
        ech_comm_italie::NUMERIC AS import_italy,
        ech_comm_suisse::NUMERIC AS import_swiss,        
        ech_comm_allemagne_belgique::NUMERIC AS import_germany_belgium
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

    -- TODO: move this to intermediate model?
    wind + solar + hydropower + bioenergy as renewable,
    fuel_oil + coal + gas + nuclear as non_renewable,
    -- according to https://palmetto.com/solar/difference-between-green-clean-and-renewable-energy
    wind + solar + bioenergy as green,
    fuel_oil + coal + gas + nuclear + hydropower  as non_green,    
    -- according to https://chariotenergy.com/chariot-university/clean-energy
    wind + solar + hydropower + bioenergy + nuclear + gas as clean,
    fuel_oil + coal as non_clean,

    import_england,
    import_spain,
    import_italy,
    import_swiss,
    import_germany_belgium
FROM typed
ORDER BY 1