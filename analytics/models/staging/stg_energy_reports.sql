{{ config(materialized='table') }}

SELECT
    n_dpe AS id,
    TO_TIMESTAMP(date_tablissement_dpe, 'YYYY-MM-DD') AS report_date,
    etiquette_ges AS ges_label,
    etiquette_dpe AS dpe_label,
    ann_e_construction AS building_year,
    code_postal_banx AS postal_code,
    position_logement_dans_immeuble AS building_position,
    p_riode_construction AS construction_period
FROM {{ source('raw_performance', 'energy_reports') }}