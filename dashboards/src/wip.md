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

There seem to be proportionally more well rated properties on the ground floor than on other floors.

Assumption #3 - incorrect ❌

</div>
