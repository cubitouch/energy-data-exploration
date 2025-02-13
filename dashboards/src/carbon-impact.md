---
toc: false
---

<div>
  <h1>Carbon Impact</h1>
</div>

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
import { useUsageVsCarbon } from "./features/usage-vs-carbon.js";
const [plotUsage, legendUsage] = useUsageVsCarbon(
  timePeriod,
  usage,
  "usage",
  "Energy Usage and Carbon Impact"
);
const [plotUsageNonClean, legendUsageNonClean] = useUsageVsCarbon(
  timePeriod,
  usage,
  "usage_non_clean",
  "Non-Clean Energy Usage and Carbon Impact"
);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width, height) => plotUsage(width, height))}
    </div>
    <div>
      ${legendUsage}
    </div>
  </div>
</div>

<div class="note">

Energy usage alone doesn't entirely correlate with carbon impact.

**Hypothesis**: Could carbon impact correlate with the energy origin (non-renewable, coal, etc)?

</div>

```js
import { useCarbonImpactHeatmap } from "./features/energy-usage-heatmap.js";
const usageHeatmapPerPeriod = {
  7: await FileAttachment(`data/energy-usage-heatmap/7-days.csv`).csv({
    typed: true,
  }),
  30: await FileAttachment(`data/energy-usage-heatmap/30-days.csv`).csv({
    typed: true,
  }),
  90: await FileAttachment(`data/energy-usage-heatmap/90-days.csv`).csv({
    typed: true,
  }),
};
const usageHeatmap = usageHeatmapPerPeriod[timePeriod];
const [plotUsageHeatmap, legendUsageHeatmap] =
  useCarbonImpactHeatmap(usageHeatmap);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width, height) => {
      const container = html`<div style="display: flex; align-items: center; flex-direction: column"></div>`;
      const plot = plotUsageHeatmap(width, height);
      const legend = legendUsageHeatmap;
      container.append(plot, legend);
      return container;
    })}
  </div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width, height) => plotUsageNonClean(width, height))}
    </div>
    <div>
      ${legendUsageNonClean}
    </div>
  </div>
</div>
<div class="note">

**Fuel Oil** and **Coal** are considered non-clean (see [here](https://chariotenergy.com/chariot-university/clean-energy)).

</div>

```js
import { useCarbonCorrelation } from "./features/energy-carbon-correlation.js";
const [plotCarbonCorrelation, legendCarbonCorrelation] =
  useCarbonCorrelation(usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width, height) => plotCarbonCorrelation(width, height))}
    </div>
    <div>
      ${legendCarbonCorrelation}
    </div>
  </div>
</div>

<div class="note">

See the [Pearson Correlation Coefficient](https://www.scribbr.com/statistics/pearson-correlation-coefficient/)

</div>
