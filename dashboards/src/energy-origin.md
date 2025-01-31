---
toc: false
---

# Energy Origin

<div class="grid grid-cols-1 time-picker">

```js
const timePeriod = view(
  Inputs.radio(
    new Map([
      ["7 days", 7],
      ["30 days", 30],
      ["90 days", 90],
    ]),
    {
      label: "Time Period",
      value: 30,
    }
  )
);
```

</div>

```js
const usagePerPeriod = {
  7: await FileAttachment(`data/energy-usage/7-days.csv`).csv({
    typed: true,
  }),
  30: await FileAttachment(`data/energy-usage/30-days.csv`).csv({
    typed: true,
  }),
  90: await FileAttachment(`data/energy-usage/90-days.csv`).csv({
    typed: true,
  }),
};
const usage = usagePerPeriod[timePeriod];

import {
  useRenewableBreakdown,
  useGreenBreakdown,
  useCleanBreakdown,
} from "./features/category-breakdown.js";
const [plot, legend] = useRenewableBreakdown(timePeriod, usage);
const [plotGreen, legendGreen] = useGreenBreakdown(timePeriod, usage);
const [plotClean, legendClean] = useCleanBreakdown(timePeriod, usage);
```

<div class="note">

For clarity, are considered as:

- **renewable**: Wind, Solar, Hydropower, Bioenergy
- **green**: Wind, Solar, Bioenergy (see [here](https://palmetto.com/solar/difference-between-green-clean-and-renewable-energy))
- **clean**: Wind, Solar, Hydropower, Bioenergy, Nuclear, Gas (see [here](https://chariotenergy.com/chariot-university/clean-energy))

</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plot(width, height))}
    </div>
    <div style="flex: 0;">
      ${legend}
    </div>
  </div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotGreen(width, height))}
    </div>
    <div style="flex: 0;">
      ${legendGreen}
    </div>
  </div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotClean(width, height))}
    </div>
    <div style="flex: 0;">
      ${legendClean}
    </div>
  </div>
</div>

<div class="note">

At the time of writing, although Nuclear being considered as _clean_ is debatable, the above chart indicates that France is using mostly clean energy.

**Improvement**: This chart would benefit from not being stacked. By doing so we would be able to tweak the Y scale, making the smaller serie more readable.

</div>

```js
import { useEnergyOriginBreakdown } from "./features/energy-origin-breakdown.js";
const [plotOrigin, legendOrigin] = useEnergyOriginBreakdown(timePeriod, usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotOrigin(width, height))}
    </div>
    <div style="flex: 0;">
      ${legendOrigin}
    </div>
  </div>
</div>

<div class="warning">
Given that most French energy is nuclear, the scale here is adjusted to a square root scale to facilitate reading trend changes.
</div>
<div class="note">

Coal-based energy production is only activated in the event of [energy usage peaks](https://www.latribune.fr/entreprises-finance/industrie/energie-environnement/france-deux-centrales-a-charbon-autorisees-a-fonctionner-jusqu-a-fin-2024-973788.html).

</div>

```js
import { useExchangeBreakdown } from "./features/exchange-breakdown.js";
const [plotExchange, legendExchange] = useExchangeBreakdown(timePeriod, usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotExchange(width, height))}
    </div>
    <div style="flex: 0;">
      ${legendExchange}
    </div>
  </div>
</div>

<div class="note">

Negative values on this chart represent exports rather than imports.

At the time of writing, this clearly indicates that France is a strong energy exporter.

</div>
