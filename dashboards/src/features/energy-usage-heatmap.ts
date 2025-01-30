import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface EnergyUsageOverWeek {
  hour: number;
  day_of_week: number;
  usage: number;
}
export const useEnergyUsageHeatmap = (data: EnergyUsageOverWeek[]) => {
  const plot = (width, height) =>
    Plot.plot({
      width,
      height: height - 84,
      marginBottom: 32,
      title: "Energy Usage Over the Week",
      marks: [
        Plot.cell(data, {
          x: "hour",
          y: "day_of_week",
          fill: "usage",
          tip: true,
          title: (d: EnergyUsageOverWeek) => `${Plot.formatWeekday(
            "en-US",
            "long"
          )(d.day_of_week)} ${d.hour}:00 - ${d.hour + 1}:00
        \nUsage: ${d3.format(".2s")(d.usage)} MW`,
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
        label: "Average (MW)",
      },
      x: {
        label: "",
        tickFormat: (d) => `${d}:00`, // Format hours as "0:00", "1:00", etc.
        domain: Array.from(Array(24).keys()), // Ensure hours are ordered from 0 to 23
        type: "band",
      },
      y: {
        label: "",
        tickFormat: (d) => Plot.formatWeekday("en-US", "short")(d),
        domain: [1, 2, 3, 4, 5, 6, 0], // Ensure Monday (1) to Sunday (0) order
        type: "band",
      },
    });
  const legend = plot(0, 0).legend("color", {
    tickFormat: "2s",
  });

  return [plot, legend];
};
