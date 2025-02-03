{{ config(materialized='table') }}

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

    import_england,
    import_spain,
    import_italy,
    import_swiss,
    import_germany_belgium,

    co2_ratio * actual * 1000 AS co2_impact,

    wind + solar + hydropower + bioenergy as renewable,
    fuel_oil + coal + gas + nuclear as non_renewable,
    -- according to https://palmetto.com/solar/difference-between-green-clean-and-renewable-energy
    wind + solar + bioenergy as green,
    fuel_oil + coal + gas + nuclear + hydropower  as non_green,    
    -- according to https://chariotenergy.com/chariot-university/clean-energy
    wind + solar + hydropower + bioenergy + nuclear + gas as clean,
    fuel_oil + coal as non_clean
FROM {{ ref('stg_energy_market_france') }}
ORDER BY 1