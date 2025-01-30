import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage_renewable: number;
  usage_non_renewable: number;
}
export const useEnergyTypeBreakdown = (
  timePeriod: number,
  data: EnergyUsage[]
) => {
  const energyTypeUsage = data.flatMap((d) => [
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

  const options: Plot.PlotOptions = {
    title: "Energy Origin Type",
    x: { ...timeAxisOptions(timePeriod) },
    y: {
      grid: true,
      label: "Usage",
      tickFormat: ".2s",
      nice: true,
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
          title: (d: (typeof energyTypeUsage)[0]) => `Date: ${d3.timeFormat(
            "%d %b %Y"
          )(new Date(d.timestamp_date))}
        \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
        })
      ),
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
