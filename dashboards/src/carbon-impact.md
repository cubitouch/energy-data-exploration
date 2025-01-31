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
  "Non Clean Energy Usage and Carbon Impact"
);
const [plotUsageNonGreen, legendUsageNonGreen] = useUsageVsCarbon(
  timePeriod,
  usage,
  "usage_non_green",
  "Non Green Energy Usage and Carbon Impact"
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

**Hypothesis**: Could carbon impact correlate with the energy origin (non renewable, coal, etc)?

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

**Fuel Oil** and **Coal** are considered non clean (see [here](https://chariotenergy.com/chariot-university/clean-energy)).

</div>
<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex; flex-direction: column;">
    <div style="flex:1;">
      ${resize((width, height) => plotUsageNonGreen(width, height))}
    </div>
    <div>
      ${legendUsageNonGreen}
    </div>
  </div>
</div>
<div class="note">

**Fuel Oil**, **Coal**, **Gas**, **Nuclear** and **Hydropower** are considered non green (see [here](https://palmetto.com/solar/difference-between-green-clean-and-renewable-energy)).

</div>
