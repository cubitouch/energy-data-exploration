import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { html } from "npm:htl";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  usage: number;
  usage_non_renewable: number;
  usage_non_green: number;
  usage_non_clean: number;
  co2_impact: number;
}
type EnergyUsageType =
  | "usage"
  | "usage_non_renewable"
  | "usage_non_green"
  | "usage_non_clean";
export const useUsageVsCarbon = (
  timePeriod: number,
  data: EnergyUsage[],
  type: EnergyUsageType,
  title: string
) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title,
      width,
      height: height - 32,
      marginTop: 32,
      marginLeft: 48,
      marginRight: 64,
      marginBottom: 48,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "Energy (MW)",
        domain: d3.extent(data, (d: EnergyUsage) => d[type]),
        tickFormat: ".2s",
        nice: true,
      },
      marks: [
        (() =>
          Plot.plot({
            // dimensions
            marginTop: 32,
            marginLeft: 48,
            marginRight: 64,
            marginBottom: 48,
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
              labelOffset: 48,
            },
            marks: [
              Plot.barY(data, {
                x: "timestamp_date",
                y: "co2_impact",
                fill: "#728698",
              }),
            ],
          })) as Plot.Markish,
        Plot.lineY(data, {
          x: "timestamp_date",
          y: type,
          tip: true,
          title: (d: EnergyUsage) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
          \nImpact: ${d3.format(".2s")(d.co2_impact)} g
          \nUsage: ${d3.format(".2s")(d[type])} MW`,
        }),
        Plot.dot(data, {
          x: "timestamp_date",
          y: type,
          fill: "white",
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
      Usage
    </div>
    <div class="legendItem-swatch">
      <svg width="16" height="16">
        <rect width="100%" height="100%" fill="#748899" />
      </svg>
      Carbon Impact
    </div>
  </div>`;

  return [plot, legend] as const;
};
