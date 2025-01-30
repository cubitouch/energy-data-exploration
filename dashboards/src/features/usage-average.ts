import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { html } from "npm:htl";
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
      height: height - 48,
      marginLeft: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "MW",
        domain: [
          d3.min(data, (d: EnergyUsage) => d.usage_min),
          d3.max(data, (d: EnergyUsage) => d.usage_max),
        ],
        nice: true,
        tickFormat: ".2s",
      },
      marks: [
        Plot.areaY(data, {
          x: "timestamp_date",
          y1: "usage_min",
          y2: "usage_max",
          fill: "#728698",
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

  const legend = html`<div
    class="legendItem-swatches-wrap"
    style="gap: 32px; justify-content: center;"
  >
    <div class="legendItem-swatch">
      <svg width="16" height="12">
        <line x1="0" y1="6" x2="16" y2="6" stroke="#fff" stroke-width="2" />
      </svg>
      Average
    </div>
    <div class="legendItem-swatch">
      <svg width="16" height="16">
        <rect width="100%" height="100%" fill="#748899" />
      </svg>
      Range
    </div>
  </div>`;

  return [plot, legend] as const;
};
