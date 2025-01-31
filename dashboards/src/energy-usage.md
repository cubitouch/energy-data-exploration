---
toc: false
---

# Energy Usage

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
```

```js
import { useUsageAverage } from "./features/usage-average.js";
const [plotUsageAverage, legendUsageAverage] = useUsageAverage(
  timePeriod,
  usage
);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width,height) => plotUsageAverage(width,height))}
    </div>
    <div>
      ${legendUsageAverage}
    </div>
  </div>
</div>
<div class="note">

The above chart shows the average, minimum, and maximum megawatts (MW) consumed **within any given 15-minute** window that day.

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
const [plotUsageHeatmap, legendUsageHeatmap] =
  useEnergyUsageHeatmap(usageHeatmap);
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

```js
import { useUsageEstimates } from "./features/usage-estimates.js";
const [plotUsageEstimates, legendUsageEstimates] = useUsageEstimates(
  timePeriod,
  usage
);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width, height) => plotUsageEstimates(width, height))}
    </div>
    <div>
      ${legendUsageEstimates}
    </div>
  </div>
</div>
<div class="note">

**Hypothesis**: Are the D-1 estimates used to arrange the import/export of energy?

**Hypothesis**: Are the D estimates always slightly higher than the actual usage to account for possible spikes?

</div>
