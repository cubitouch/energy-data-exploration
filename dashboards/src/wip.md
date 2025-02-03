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