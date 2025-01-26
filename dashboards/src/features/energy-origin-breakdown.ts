import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

export const useEnergyOriginBreakdown = (timePeriod: number, usage: any[]) => {
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

  return [plotOrigin, legendOrigin];
};
