import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface EnergyUsageOverWeek {
  hour: number;
  day_of_week: number;
  usage: number;
  co2_impact: number;
}
interface HeatmapOptions {
  title: string;
  type: "usage" | "co2_impact";
  typeTooltip: (d: EnergyUsageOverWeek) => string;
  reversedColorRange: boolean;
  legendLabel: string;
  domain: number[];
}
const useHeatmap = (data: EnergyUsageOverWeek[], options: HeatmapOptions) => {
  const colorRange = ["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"];

  const plot = (width, height) =>
    Plot.plot({
      width,
      height: height - 84,
      marginBottom: 32,
      title: options.title,
      marks: [
        Plot.cell(data, {
          x: "hour",
          y: "day_of_week",
          fill: options.type,
          tip: true,
          title: (d: EnergyUsageOverWeek) => `${Plot.formatWeekday(
            "en-US",
            "long"
          )(d.day_of_week)} ${d.hour}:00 - ${d.hour + 1}:00
        \n${options.typeTooltip(d)}`,
        }),
      ],
      color: {
        type: "linear",
        range: d3.quantize(
          d3
            .scaleLinear()
            .domain(options.domain) // Relative positions for the colors
            .range(
              options.reversedColorRange
                ? [...colorRange].reverse()
                : colorRange
            ) // Start, middle, and end colors
            .interpolate(d3.interpolateRgb),
          20
        ), // Use RGB interpolation
        label: options.legendLabel,
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
  const legend = plot(0, 84).legend("color", {
    tickFormat: "2s",
  });

  return [plot, legend];
};

export const useEnergyUsageHeatmap = (data: EnergyUsageOverWeek[]) => {
  return useHeatmap(data, {
    title: "Energy Usage Over the Week",
    type: "usage",
    typeTooltip: (d) => `Usage: ${d3.format(".2s")(d.usage)} MW`,
    legendLabel: "Average (MW)",
    reversedColorRange: false,
    domain: [0, 0.5, 0.75, 0.9, 1],
  });
};
export const useCarbonImpactHeatmap = (data: EnergyUsageOverWeek[]) => {
  return useHeatmap(data, {
    title: "Carbon Impact Over the Week",
    type: "co2_impact",
    typeTooltip: (d) => `Impact: ${d3.format(".2s")(d.co2_impact)} g`,
    legendLabel: "Average (g)",
    reversedColorRange: true,
    domain: [0, 0.1, 0.25, 0.5, 1],
  });
};
