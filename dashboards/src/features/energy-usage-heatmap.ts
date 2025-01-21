import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export function energyUsageHeatmap(
  usageHeatmap: any[],
  width: number,
  height: number
) {
  return Plot.plot({
    width,
    height: height - 32,
    title: "Energy Usage Over the Week Last Month",
    marks: [
      Plot.cell(usageHeatmap, {
        x: "hour",
        y: "day_of_week",
        fill: "usage",
        tip: true,
        title: (data) => `${Plot.formatWeekday("en-US", "long")(data.day_of_week)
        } ${data.hour}:00 - ${data.hour + 1}:00
        \nUsage: ${d3.format(".2s")(data.usage)} MW`,
      }),
    ],
    color: {
      type: "linear",
      range: d3.quantize(
        d3
          .scaleLinear()
          .domain([0, 0.5, 0.75, 0.9, 1]) // Relative positions for the colors
          .range(["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"]) // Start, middle, and end colors
          .interpolate(d3.interpolateRgb),
        20
      ), // Use RGB interpolation
      label: "Average Usage",
    },
    x: {
      label: "",
      tickFormat: (d) => `${d}:00`, // Format hours as "0:00", "1:00", etc.
      domain: [...Array(24).keys()], // Ensure hours are ordered from 0 to 23
      type: "band",
    },
    y: {
      label: "",
      tickFormat: (d) => Plot.formatWeekday("en-US", "short")(d),
      domain: [1, 2, 3, 4, 5, 6, 0], // Ensure Monday (1) to Sunday (0) order
      type: "band",
    },
  });
}
