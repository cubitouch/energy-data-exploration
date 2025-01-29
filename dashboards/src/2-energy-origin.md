---
toc: false
---

# Energy Origin

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
      value: 7,
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

import { useEnergyTypeBreakdown } from "./features/energy-type-breakdown.js";
const [plot, legend] = useEnergyTypeBreakdown(timePeriod, usage);
```

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
