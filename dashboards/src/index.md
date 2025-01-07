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
  <div class="card">${
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

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width, height) => Plot.plot({
      width,
      height: height - 32,
      title: "Energy usage over the week last month",
      marks: [
        Plot.cell(usageHeatmap, {
          x: "hour",
          y: "day_of_week",
          fill: "usage",
          title: d => `Hour: ${d.hour}, Day: ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day_of_week]}\nUsage: ${Number(d.usage).toFixed(2)}`
        })
      ],
      color: {
        type: "linear",
        range: d3.quantize(d3.scaleLinear()
          .domain([0, 0.5, 1]) // Relative positions for the colors
          .range(["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"]) // Start, middle, and end colors
          .interpolate(d3.interpolateRgb), 20), // Use RGB interpolation
        label: "Average Usage"
      },
      x: {
        label: "",
        tickFormat: d => `${d}:00`, // Format hours as "0:00", "1:00", etc.
        domain: [...Array(24).keys().map(t => t.toString())], // Ensure hours are ordered from 0 to 23
        type: "band"
      },
      y: {
        label: "",
        tickFormat: d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d], // Adjust for Monday-first
        domain: ['1', '2', '3', '4', '5', '6', '0'], // Ensure Monday (1) to Sunday (7) order
        type: "band"
      }
    }))
  }</div>
</div>

<style>

* {
  font-family: "Titillium Web", sans-serif;
}
:root {
  --theme-background-b: rgb(56, 66, 89);
}

</style>
