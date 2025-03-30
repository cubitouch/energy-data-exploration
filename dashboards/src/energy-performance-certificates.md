---
toc: false
---

# Energy Performance in Paris

---

## Problem

Where to search in Paris to find an energy efficient property to rent?

## Assumptions

1. Paris has a decent amount of well rated properties.
2. Some postal codes have a higher amount of energy efficient flats (say, rated from A to C).
3. Flats located on the ground floor have a worst rating, as they as less well isolated.
4. Some construction eras have most efficient ratings than others.

## Data source

[data.ademe.fr](https://data.ademe.fr/datasets/dpe-v2-logements-existants)

---

```js
import { usePerMonth } from "./features/reports/per-month.js";
const perMonth = await FileAttachment(`data/reports/per-month.csv`).csv({
  typed: true,
});
const [plotPerMonth, legendPerMonth] = usePerMonth(perMonth);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotPerMonth(width,height))}
    </div>
  </div>
</div>

```js
import { useRatingsPerPostalCode } from "./features/reports/ratings-per-postal-code.js";
const ratingsPerPostalCode = await FileAttachment(
  `data/reports/ratings-per-postal-code.csv`
).csv({
  typed: true,
});
const [plotRatingsPerPostalCode, legendRatingsPerPostalCode] =
  useRatingsPerPostalCode(ratingsPerPostalCode);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotRatingsPerPostalCode(width,height))}
    </div>
    <div style="flex: 0; justify-items: center;">
      ${legendRatingsPerPostalCode}
    </div>
  </div>
</div>

<div class="note">

There is a low amount of properties rated A, B or C.

Assumption #1 - incorrect ❌

</div>

```js
import { useGeoPerPostalCode } from "./features/reports/geo-per-postal-code.js";
const [plotGeoPerPostalCode, legendGeoPerPostalCode] =
  useGeoPerPostalCode(ratingsPerPostalCode);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotGeoPerPostalCode(width,height))}
    </div>
    <div style="flex: 0; justify-items: center;">
      ${legendGeoPerPostalCode}
    </div>
  </div>
</div>
<div class="note">

At the time of writing 75020, 75013 and 75019 postal codes have a higher number of properties having been energy performance rated either A, B or C.

Assumption #2 - confirmed ✅

</div>

```js
import { useRatingsPerFloor } from "./features/reports/ratings-per-floor.js";
const ratingsPerFloor = await FileAttachment(
  `data/reports/ratings-per-floor.csv`
).csv({
  typed: true,
});
const [plotRatingsPerFloor, legendRatingsPerFloor] =
  useRatingsPerFloor(ratingsPerFloor);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotRatingsPerFloor(width,height))}
    </div>
    <div style="flex: 0; justify-items: center;">
      ${legendRatingsPerFloor}
    </div>
  </div>
</div>

<div class="note">

There seem to be proportionally less well rated properties on the ground floor than on other floors.

Assumption #3 - confirmed ✅

</div>

```js
import { usePeriodRatingHeatmap } from "./features/reports/period-rating-heatmap.js";
const ratingsPerFloor = await FileAttachment(
  `data/reports/period-rating-heatmap.csv`
).csv({
  typed: true,
});
const [plotPeriodRatingHeatmap, legendPeriodRatingHeatmap] =
  usePeriodRatingHeatmap(ratingsPerFloor);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotPeriodRatingHeatmap(width,height))}
    </div>
    <div style="flex: 0; justify-items: center;">
      ${legendPeriodRatingHeatmap}
    </div>
  </div>
</div>

<div class="note">

Properties built since 2001 offer 75% or more C ratings and a growing amount of B ratings.
Properties built between 1975 and 1977 may have been maintained (or built?) better, explaining a high C ratings amount within the older range.

Assumption #4 - confirmed ✅

</div>

---

## Conclusions

1. ❌ Paris has few well rated properties,
2. ✅ 75020, 75013 and 75019 are more efficient,
3. ❌ Ground floor flats are actually more efficient,
4. ✅ Recent constructions are usually more efficient.

<div class="note">

Further analysis: Can we represent a corelation of assumptions #2 and #4 via a construction era breakdown per postal codes? This would re-enforce assumption #2 findings, if 75020, 75013 and 75019 postal codes have higher amount of properties built since 1982 and/or since 2001, compared to other postal codes.

</div>
