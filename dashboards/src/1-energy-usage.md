---
toc: false
---

# Energy Usage

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
```

```js
import { useUsageAverage } from "./features/usage-average.js";
const [plotUsageAverage] = useUsageAverage(timePeriod, usage);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width) => plotUsageAverage(width))}
  </div>
</div>
<div class="note">

The above chart shows average, minimum and maximum of MW consumed **within any given 15 minutes** window that day.

</div>

```js
import { useUsageEstimates } from "./features/usage-estimates.js";
const [plotUsageEstimates, legendUsageEstimates] = useUsageEstimates(
  timePeriod,
  usage
);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${resize((width, height) => plotUsageEstimates(width, height))}
    </div>
    <div style="flex: 0;">
      <div style="display: flex; flex-direction: column; gap: 8px; font-family: sans-serif; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#748899" stroke-width="2" />
          </svg>
          <span>Estimated (D-1)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#cbefe2" stroke-width="2" stroke-dasharray="4" />
          </svg>
          <span>Estimated (D)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#fff" stroke-width="2" />
          </svg>
          <span>Actual Usage</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="note">

**Hypothesis**: The D-1 estimates are used to arrange import/export of energy?

**Hypothesis**: The D estimates are always(?) slightly higher than the effective usage to cater for possible spikes?
</div>
