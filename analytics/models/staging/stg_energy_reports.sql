{{ config(materialized='table') }}

SELECT
    numero_dpe AS id,
    TO_TIMESTAMP(date_etablissement_dpe, 'YYYY-MM-DD') AS report_date,
    etiquette_ges AS ges_label,
    etiquette_dpe AS dpe_label,
    annee_construction AS building_year,
    code_postal_ban AS postal_code,
    numero_etage_appartement AS floor_number,
    replace(replace(periode_construction, 'avant', 'before'), 'après', 'after') AS construction_period
FROM {{ source('raw_performance', 'energy_reports_2025') }}
WHERE type_batiment = 'appartement' -- appartement, maison