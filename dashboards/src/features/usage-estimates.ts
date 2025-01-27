import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage: number;
  usage_estimated_d1: number;
  usage_estimated_d: number;
}
export const useUsageEstimates = (timePeriod: number, data: EnergyUsage[]) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "Estimated Energy Usage",
      width,
      marginLeft: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "MW",
        tickFormat: ".2s",
      },
      marks: [
        Plot.lineY(data, {
          x: "timestamp_date",
          y: "usage_estimated_d1",
          stroke: "#748899",
        }),
        Plot.lineY(data, {
          x: "timestamp_date",
          y: "usage_estimated_d",
          strokeDasharray: 4,
          stroke: "#cbefe2",
        }),
        Plot.lineY(data, { x: "timestamp_date", y: "usage" }),
        Plot.dot(data, {
          x: "timestamp_date",
          y: "usage",
          fill: "white",
          tip: true,
          title: (d: EnergyUsage) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
            \nActual: ${d3.format(".2s")(d.usage)} MW
            \nEstimated (D-1): ${d3.format(".2s")(d.usage_estimated_d1)} MW
            \nEstimated (D): ${d3.format(".2s")(d.usage_estimated_d)} MW`,
        }),
      ],
    });

  return [plot] as const;
};
