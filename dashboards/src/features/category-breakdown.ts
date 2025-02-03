import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage_renewable: number;
  usage_non_renewable: number;
  usage_green: number;
  usage_non_green: number;
  usage_clean: number;
  usage_non_clean: number;
}
interface CategoryBreakdownOptions {
  title: string;
  color: Plot.ScaleOptions;
  type?: Plot.ScaleType;
}
export const useCategoryBreakdown = (
  timePeriod: number,
  data: {
    timestamp_date: string;
    usage: number;
    source: string;
  }[],
  config: CategoryBreakdownOptions
) => {
  const options: Plot.PlotOptions = {
    title: config.title,
    x: { ...timeAxisOptions(timePeriod) },
    y: {
      grid: true,
      label: "Usage",
      tickFormat: ".2s",
      type: config.type ?? "linear",
      nice: true,
    },
    color: { ...config.color },
    marks: [
      Plot.barY(
        data,
        Plot.stackY({
          x: "timestamp_date",
          y: "usage",
          fill: "source",
          tip: true,
          title: (d: (typeof data)[0]) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
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

export const useRenewableBreakdown = (
  timePeriod: number,
  data: EnergyUsage[]
) => {
  const options: CategoryBreakdownOptions = {
    title: "Renewable Energy Usage",
    color: {
      domain: ["Non Renewable", "Renewable"],
      range: ["#748899", "#ebf9f4"],
    },
  };

  return useCategoryBreakdown(
    timePeriod,
    data.flatMap((d) => [
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
    ]),
    options
  );
};

export const useCleanBreakdown = (timePeriod: number, data: EnergyUsage[]) => {
  const options: CategoryBreakdownOptions = {
    title: "Clean Energy Usage",
    color: {
      domain: ["Clean", "Non-Clean"],
      range: ["#ebf9f4", "#748899"],
    },
    type: "sqrt",
  };

  return useCategoryBreakdown(
    timePeriod,
    data.flatMap((d) => [
      {
        timestamp_date: d.timestamp_date,
        usage: d.usage_non_clean,
        source: "Non-Clean",
      },
      {
        timestamp_date: d.timestamp_date,
        usage: d.usage_clean,
        source: "Clean",
      },
    ]),
    options
  );
};
