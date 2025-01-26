import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

export const useUsageAverage = (timePeriod: number, usage: any[]) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "Average Energy Usage",
      width,
      marginLeft: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "MW",
        domain: [0, d3.max(usage, (d) => d.usage_max)],
        tickFormat: ".2s",
      },
      marks: [
        Plot.ruleY([0]),
        Plot.areaY(usage, {
          x: "timestamp_date",
          y1: "usage_min",
          y2: "usage_max",
          fill: "#cbefe2",
          opacity: 0.5,
        }),
        Plot.lineY(usage, { x: "timestamp_date", y: "usage_average" }),
        Plot.dot(usage, {
          x: "timestamp_date",
          y: "usage_average",
          fill: "white",
          tip: true,
          title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
            \nAverage: ${d3.format(".2s")(d.usage_average)} MW
            \nRange: ${d3.format(".2s")(d.usage_min)} - ${d3.format(".2s")(
            d.usage_max
          )} MW`,
        }),
      ],
    });

  return [plot];
};
