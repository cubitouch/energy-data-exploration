import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

export const useEnergyTypeBreakdown = (timePeriod: number, usage: any[]) => {
  const energyTypeUsage = usage.flatMap((d) => [
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

  const plot = (width, height) =>
    Plot.plot({
      title: "Energy Origin Type",
      width,
      height: height - 64,
      // Configure axes
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "Usage",
        tickFormat: ".2s",
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
            title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
              new Date(d.timestamp_date)
            )}
          \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
          })
        ),
      ],
    });

  const legend = Plot.legend({
    color: {
      domain: ["Non Renewable", "Renewable"],
      range: ["#748899", "#ebf9f4"],
    },
    label: "Energy Sources",
    swatchSize: 16,
    className: "legendItem",
  });

  return [plot, legend];
};
