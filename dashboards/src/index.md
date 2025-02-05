---
toc: false
---

# Overview

---

## Preamble

This app is an exploratory work-in-progress using French energy and climate open data.

## Data sources

### Energy Market France

The national level data published [here](https://ecologie.data.gouv.fr/datasets/55f0463d88ee3849f5a46ec1) includes, among other things:

- Energy usage and estimates (D and D-1)
- Usage breakdown by energy type (coal, wind, solar, etc.)
- Corresponding CO₂ ratio
- Country of origin for the energy usage

The data is recorded in 15-minute intervals and spans from early 2023 onward. New data becomes available throughout the day, but this dashboard is refreshed only once per night.


### Energy Performance Certificates (DPE)

The data published [here](https://ecologie.data.gouv.fr/datasets/6347fc2859c3545c0c28005d) includes all certificates established **since 2021**.
The data is refreshed mensually.

<div class="warning">

At the time of writing (early Feb 2025) this source is marked as deprecated, to be replaced by a dataset yet to be published.

For this reason, the corresponding data pipeline is currently ran ad-hoc.

</div>