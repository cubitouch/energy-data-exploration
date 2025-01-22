---
toc: false
---

# Energy Origin

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

```js
import { timeAxisOptions } from "./utils/formats.js";

const usagePerPeriod = {
  "7": await FileAttachment(`data/energy-usage/7-days.csv`).csv({
    typed: true,
  }),
  "30": await FileAttachment(`data/energy-usage/30-days.csv`).csv({
    typed: true,
  }),
  "90": await FileAttachment(`data/energy-usage/90-days.csv`).csv({
    typed: true,
  }),
};
const usage = usagePerPeriod[timePeriod];

const energyTypeUsage = usage.flatMap((d) => [
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_renewable,
    source: "Renewable",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.usage_non_renewable,
    source: "Non Renewable",
  },
]);
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${
      resize((width, height) => Plot.plot({
        title: "Energy Origin Type",
        width,
        height: height - 64,
        // Configure axes
        x: {...timeAxisOptions(timePeriod)},
        y: {
          grid: true,
          label: "Usage",
          tickFormat: ".2s",
        },
        color: {
          domain: ["Non Renewable", "Renewable"],
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
              title: d => `Date: ${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))}
              \n${d.source}: ${d3.format(".2s")(d.usage)} MW`
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

const plotOrigin = (width, height) =>
  Plot.plot({
    title: "Energy Origin",
    width,
    height: height - 64,
    x: { ...timeAxisOptions(timePeriod) },
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
        title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
          new Date(d.timestamp_date)
        )}
              \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
      }),
    ],
  });

const legendOrigin = Plot.legend({
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
  className: "legendItem",
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${
        resize((width, height) => plotOrigin(width, height))
      }
    </div>
    <style>
      .legendItem-swatch { height: 32px;}
    </style>
    <div style="flex: 0;">
      ${
        legendOrigin
      }
    </div>
  </div>
</div>

```js
const energyExchange = usage.flatMap((d) => [
  {
    timestamp_date: d.timestamp_date,
    usage: d.import_england,
    source: "England",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.import_spain,
    source: "Spain",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.import_italy,
    source: "Italy",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.import_swiss,
    source: "Swiss",
  },
  {
    timestamp_date: d.timestamp_date,
    usage: d.import_germany_belgium,
    source: "Germany and Belgium",
  },
]);

const plotExchange = (width, height) =>
  Plot.plot({
    title: "Energy Exchanges",
    width,
    height: height - 64,
    x: { ...timeAxisOptions(timePeriod) },
    y: {
      grid: true,
      label: "Import",
      tickFormat: ".2s",
    },
    color: {
      domain: ["England", "Spain", "Italy", "Swiss", "Germany and Belgium"],
      range: d3.schemeTableau10,
      legend: false, // Disable the integrated legend
    },
    marks: [
      Plot.barY(
        energyExchange,
        Plot.stackY({
          x: "timestamp_date",
          y: "usage",
          fill: "source",
          tip: true,
          title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
              \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
        })
      ),
    ],
  });
const legendExchanges = Plot.legend({
  color: {
    domain: ["England", "Spain", "Italy", "Swiss", "Germany and Belgium"],
    range: d3.schemeTableau10,
  },
  label: "Energy Sources",
  swatchSize: 16,
  className: "legendItem",
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card" style="display: flex">
    <div style="flex:1;">
      ${
        resize((width, height) => plotExchange(width, height))
      }
    </div>
    <style>
      .legendItem-swatch { height: 32px;}
    </style>
    <div style="flex: 0;">
      ${
        legendExchanges
      }
    </div>
  </div>
</div>