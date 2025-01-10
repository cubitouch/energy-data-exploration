---
toc: false
---

<div>
  <h1>Energy Market France</h1>
</div>

```js
const usage = FileAttachment("data/energy-usage.csv").csv();
const usageHeatmap = FileAttachment("data/energy-usage-heatmap.csv").csv();
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width) => Plot.plot({
      title: "Energy usage over the last 30 days",
      width,
      marginLeft: 64,
      x: {
        tickRotate: -45,
        label: '',
        type: "time",
        tickFormat: d => d3.timeFormat("%b %d")(d)
      },
      y: {
        grid: true,
        label: "MWh(?)",
        domain: [0, d3.max(usage, d => d.usage)],
        tickFormat: d => d3.format(".2s")(d)
      },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(usage, {x: "timestamp_date", y: "usage"}),
        Plot.dot(usage, {
          x: "timestamp_date",
          y: "usage",
          fill: "white", 
          tip: true,
          title: d => `Date: ${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))}\nUsage: ${d3.format(".2s")(d.usage)} MWh`
        }),
      ]
    }))
  }</div>
</div>

```js
import { energyUsageHeatmap } from "./components/energy-usage-heatmap.js";
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width, height) => energyUsageHeatmap(usageHeatmap, width, height))}
  </div>
</div>

