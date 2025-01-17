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
      title: "Daily Energy Usage over the Last 30 Days",
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
        label: "MW",
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
          title: d => `Date: ${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))}
          \nUsage: ${d3.format(".2s")(d.usage)} MW`
        }),
      ]
    }))
  }</div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width) => Plot.plot({
      title: "Daily Range and Average of Energy Usage Over the Last 30 Days",
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
        label: "MW",
        domain: [0, d3.max(usage, d => d.usage_max)],
        tickFormat: d => d3.format(".2s")(d)
      },
      marks: [
        Plot.ruleY([0]),
        Plot.areaY(usage, {
          x: "timestamp_date",
          y1: "usage_min", 
          y2: "usage_max",
          fill: "#cbefe2",
          opacity: 0.5
        }),
        Plot.lineY(usage, {x: "timestamp_date", y: "usage_average"}),
        Plot.dot(usage, {
          x: "timestamp_date",
          y: "usage_average",
          fill: "white", 
          tip: true,
          title: d => `Date: ${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))}
          \nAverage: ${d3.format(".2s")(d.usage_average)} MW
          \nRange: ${d3.format(".2s")(d.usage_min)} - ${d3.format(".2s")(d.usage_max)} MW`
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

