import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage_min: number;
  usage_max: number;
  usage_average: number;
}
export const useUsageAverage = (timePeriod: number, data: EnergyUsage[]) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "Average Energy Usage",
      width,
      marginLeft: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "MW",
        domain: [0, d3.max(data, (d: EnergyUsage) => d.usage_max)],
        tickFormat: ".2s",
      },
      marks: [
        Plot.ruleY([0]),
        Plot.areaY(data, {
          x: "timestamp_date",
          y1: "usage_min",
          y2: "usage_max",
          fill: "#cbefe2",
          opacity: 0.5,
        }),
        Plot.lineY(data, { x: "timestamp_date", y: "usage_average" }),
        Plot.dot(data, {
          x: "timestamp_date",
          y: "usage_average",
          fill: "white",
          tip: true,
          title: (d: EnergyUsage) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
            \nAverage: ${d3.format(".2s")(d.usage_average)} MW
            \nRange: ${d3.format(".2s")(d.usage_min)} - ${d3.format(".2s")(
            d.usage_max
          )} MW`,
        }),
      ],
    });

  return [plot] as const;
};
