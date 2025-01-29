---
toc: false
---

<div>
  <h1>Overview</h1>
</div>

<div class="grid grid-cols-1">

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
const [plotUsage] = useUsageVsCarbon(timePeriod, usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">

  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotUsage(width, height))}
    </div>
    <div style="flex: 0;">
      <div style="display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#fff" stroke-width="2" />
          </svg>
          <span>Usage</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="16">
            <rect width="100%" height="100%" fill="#748899" />
          </svg>
          <span>Carbon Impact</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="note">

Energy usage doesn't entirely correlate with carbon impact.

**Hypothesis**: This correlation could be represented through energy origin (renewable, coal, etc)?
</div>

```js
import { useEnergyUsageHeatmap } from "./features/energy-usage-heatmap.js";
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
const [plotUsageHeatmap, legendUsageHeatmap] = useEnergyUsageHeatmap(usageHeatmap);
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
<div class="note">

The above chart displays the **average usage during a given hour**. For example, if there are two slots for the same weekday and hour, representing 1 MW and 2 MW usage respectively, the chart will show a 1.5 MW average.

At the time of writing, this chart clearly shows that Saturdays and Sundays are less active. The same is usually true from midnight to 6AM.

**Hypothesis**: Correlation of energy usage with meteorological data (e.g. temperature) could explain why some days would not follow expected patterns (e.g. a Sunday being much colder than usual during the period, triggering more heaters to be on).
</div>
