import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage_fuel_oil: number;
  usage_coal: number;
  usage_gas: number;
  usage_nuclear: number;
  usage_wind: number;
  usage_solar: number;
  usage_hydropower: number;
  usage_pumped_storage: number;
  usage_bioenergy: number;
}
export const useEnergyOriginBreakdown = (
  timePeriod: number,
  data: EnergyUsage[]
) => {
  const energyOriginUsage = data.flatMap((d) => [
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

  const options: Plot.PlotOptions = {
    title: "Energy Origin",
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
      range: d3.schemeSet2,
    },
    marks: [
      Plot.line(energyOriginUsage, {
        x: "timestamp_date",
        y: "usage",
        stroke: "source",
        strokeWidth: 2,
        tip: true,
        title: (d: (typeof energyOriginUsage)[0]) => `Date: ${d3.timeFormat(
          "%d %b %Y"
        )(new Date(d.timestamp_date))}
                  \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
      }),
      Plot.ruleY([0]),
    ],
  };

  const plot = (width, height) =>
    Plot.plot({ ...options, width, height: height - 64 });

  const legend = Plot.legend({
    color: options.color,
    swatchSize: 16,
    className: "legendItem",
    width: 90,
  });

  return [plot, legend] as const;
};
