import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

export const useUsageVsCarbon = (timePeriod: number, usage: any[]) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "Energy Usage and Carbon Impact",
      width,
      height: height - 32,
      marginBottom: 64,
      marginLeft: 64,
      marginRight: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "Energy (MW)",
        domain: d3.extent(usage, (d) => d.usage),
        tickFormat: ".2s",
        nice: true,
      },
      marks: [
        Plot.lineY(usage, { x: "timestamp_date", y: "usage" }),
        Plot.dot(usage, {
          x: "timestamp_date",
          y: "usage",
          fill: "white",
        }),
        (() =>
          Plot.plot({
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
                title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
                  new Date(d.timestamp_date)
                )}
            \nImpact: ${d3.format(".2s")(d.co2_impact)} g
            \nUsage: ${d3.format(".2s")(d.usage)} MW`,
              }),
            ],
          })) as Plot.Markish,
      ],
    });

  return [plot];
};
