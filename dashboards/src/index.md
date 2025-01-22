---
toc: false
---

<div>
  <h1>Energy Market France</h1>
</div>

```js
import { timeAxisOptions } from "./utils/formats.js";

const usage = FileAttachment("data/energy-usage.csv").csv({ typed: true });
const usageHeatmap = FileAttachment("data/energy-usage-heatmap.csv").csv({
  typed: true,
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width, height) => Plot.plot({
      title: "Energy Usage and Carbon Impact",
      width, 
      height: height - 32,
      marginBottom: 64,
      marginLeft: 64,
      marginRight: 64,
      x: {...timeAxisOptions},
      y: {
        grid: true,
        label: "Energy (MW)",
        domain: d3.extent(usage, d => d.usage),
        tickFormat: ".2s",
        nice: true,
      },
      marks: [
        Plot.lineY(usage, {x: "timestamp_date", y: "usage"}),
        Plot.dot(usage, {
          x: "timestamp_date",
          y: "usage",
          fill: "white", 
        }),
        () => Plot.plot({
          // dimensions
          marginBottom: 64,
          marginLeft: 64,
          marginRight: 64,
          width,
          height: height - 32,
          x: {
            axis: null,
            type: "band",
            nice: true,
          },
          y: {
            type: "linear",
            label: "Co2 (g)",
            tickFormat: ".2s",
            axis: "right",
            line: true,
            nice: true,
          },
          marks: [
            Plot.barY(usage, {
              x: "timestamp_date",
              y: "co2_impact",
              fill: "#cbefe2",
              opacity: 0.5,
              tip: true,
              title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))}
              \nImpact: ${d3.format(".2s")(d.co2_impact)} g
              \nUsage: ${d3.format(".2s")(d.usage)} MW`
            }),
          ],
        }),
      ]
    }))
  }</div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width) => Plot.plot({
      title: "Average Energy Usage",
      width,
      marginLeft: 64,
      x: {...timeAxisOptions},
      y: {
        grid: true,
        label: "MW",
        domain: [0, d3.max(usage, d => d.usage_max)],
        tickFormat: ".2s",
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
import { energyUsageHeatmap } from "./features/energy-usage-heatmap.js";
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${resize((width, height) => energyUsageHeatmap(usageHeatmap, width, height))}
  </div>
</div>
