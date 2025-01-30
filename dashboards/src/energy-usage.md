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
