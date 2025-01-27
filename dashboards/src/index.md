---
toc: false
---

<div>
  <h1>Overview</h1>
</div>

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
      value: 7,
    }
  )
);
```

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
const [plotUsage] = useUsageVsCarbon(timePeriod, usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width, height) => plotUsage(width, height))}
  </div>
</div>


```js
import { energyUsageHeatmap } from "./features/energy-usage-heatmap.js";
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
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width, height) => energyUsageHeatmap(usageHeatmap, width, height))}
  </div>
</div>
