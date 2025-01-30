import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { html } from "npm:htl";
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
      height: height - 48,
      marginLeft: 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "MW",
        tickFormat: ".2s",
        nice: true,
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

  const legend = html`<div
    class="legendItem-swatches-wrap"
    style="gap: 32px; justify-content: center;"
  >
    <div class="legendItem-swatch">
      <svg width="16" height="12">
        <line x1="0" y1="6" x2="16" y2="6" stroke="#748899" stroke-width="2" />
      </svg>
      Estimated (D-1)
    </div>
    <div class="legendItem-swatch">
      <svg width="16" height="12">
        <line
          x1="0"
          y1="6"
          x2="16"
          y2="6"
          stroke="#cbefe2"
          stroke-width="2"
          stroke-dasharray="4"
        />
      </svg>
      Estimated (D)
    </div>
    <div class="legendItem-swatch">
      <svg width="16" height="12">
        <line x1="0" y1="6" x2="16" y2="6" stroke="#fff" stroke-width="2" />
      </svg>
      Actual Usage
    </div>
  </div>`;

  return [plot, legend] as const;
};
