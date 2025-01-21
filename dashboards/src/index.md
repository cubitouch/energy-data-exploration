---
toc: false
---

<div>
  <h1>Energy Market France</h1>
</div>

```js
const usage = FileAttachment("data/energy-usage.csv").csv({ typed: true });
const usageHeatmap = FileAttachment("data/energy-usage-heatmap.csv").csv({
  typed: true,
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
  ${
    resize((width, height) => Plot.plot({
      title: "Energy Usage and Carbon Impact over the Last 30 Days",
      width, 
      height: height - 32,
      marginBottom: 64,
      marginLeft: 64,
      marginRight: 64,
      x: {
        tickRotate: -45,
        label: '',
        type: "band",
        tickFormat: "%b %d",
        nice: true,
      },
      y: {
        grid: true,
        label: "Energy Usage (MW)",
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
            label: "Co2 Impact (g)",
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
      title: "Average Energy Usage Over the Last 30 Days",
      width,
      marginLeft: 64,
      x: {
        tickRotate: -45,
        label: '',
        type: "band",
        tickFormat: "%b %d",
        nice: true,
      },
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

```js
const energyTypeUsage = usage.flatMap((d) => [
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_renewable,
    source: "renewable",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_non_renewable,
    source: "non_renewable",
  },
]);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${
      resize((width, height) => Plot.plot({
        title: "Energy Origin Type over the Last 30 Days",
        width,
        height: height - 64,
        // Configure axes
        x: {
          tickRotate: -45,
          label: '',
          type: "band",
          tickFormat: "%b %d",
          nice: true,
        },
        y: {
          grid: true,
          label: "Usage",
          tickFormat: ".2s",
        },
        color: {
          domain: ["non_renewable", "renewable"],
          range: ["#748899", "#ebf9f4"],
        },
        marks: [
          Plot.barY(
            energyTypeUsage,
            Plot.stackY({
              x: "timestamp_date",
              y: "usage",
              fill: "source",
              tip: true,
              title: d => `${{"renewable": "Renewable", "non_renewable":"Non Renewable"}[d.source]}: ${d3.format(".2s")(d.usage)} MW`
            }),
          )
        ]
      }))
    }
  </div>
</div>

```js
const energyOriginUsage = usage.flatMap((d) => [
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_fuel_oil,
    source: "Fuel Oil",
  },
  { timestamp_date: d.timestamp_date, usage: d.usage_coal, source: "Coal" },
  { timestamp_date: d.timestamp_date, usage: d.usage_gas, source: "Gas" },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_nuclear,
    source: "Nuclear",
  },
  { timestamp_date: d.timestamp_date, usage: d.usage_wind, source: "Wind" },
  { timestamp_date: d.timestamp_date, usage: d.usage_solar, source: "Solar" },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_hydropower,
    source: "Hydropower",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_pumped_storage,
    source: "Pumped Storage",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_bioenergy,
    source: "Bioenergy",
  },
]);

const plot = (width, height) =>
  Plot.plot({
    title: "Energy Origin over the Last 30 Days",
    width,
    height: height - 64,
    // Configure axes
    x: {
      tickRotate: -45,
      label: "",
      type: "band",
      tickFormat: "%b %d",
      nice: true,
    },
    y: {
      grid: true,
      label: "Usage",
      tickFormat: ".2s",
      nice: true,
      type: "sqrt",
    },
    // Define color scale for all sources
    color: {
      domain: [
        "Fuel Oil",
        "Coal",
        "Gas",
        "Nuclear",
        "Wind",
        "Solar",
        "Hydropower",
        "Pumped Storage",
        "Bioenergy",
      ],
      range: d3.schemeTableau10,
      legend: false, // Disable the integrated legend
    },
    // Add the line marks
    marks: [
      Plot.line(energyOriginUsage, {
        x: "timestamp_date",
        y: "usage",
        stroke: "source", // Differentiates lines by source
        strokeWidth: 2, // Adjust line thickness
        tip: true,
        title: (d) => `${d.source}: ${d3.format(".2s")(d.usage)} MW`,
      }),
    ],
  });

const legend = Plot.legend({
  color: {
    domain: [
      "Fuel Oil",
      "Coal",
      "Gas",
      "Nuclear",
      "Wind",
      "Solar",
      "Hydropower",
      "Pumped Storage",
      "Bioenergy",
    ],
    range: d3.schemeTableau10,
  },
  label: "Energy Sources",
  swatchSize: 16,
  className: 'legendItem'
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${
        resize((width, height) => plot(width, height))
      }
    </div>
    <style>
      .legendItem-swatch { height: 32px;}
    </style>
    <div style="flex: 0;">
      ${
        legend
      }
    </div>
  </div>
</div>
