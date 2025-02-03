import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { html } from "npm:htl";

interface EnergyUsage {
  usage_non_clean: number;
  co2_impact: number;
}

function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error("Arrays must have the same length");
  }

  const n = x.length;
  const meanX = d3.mean(x) ?? 0;
  const meanY = d3.mean(y) ?? 0;

  const numerator =
    d3.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY))) ?? 0;
  const denominatorX = Math.sqrt(
    d3.sum(x.map((xi) => Math.pow(xi - meanX, 2))) ?? 0
  );
  const denominatorY = Math.sqrt(
    d3.sum(y.map((yi) => Math.pow(yi - meanY, 2))) ?? 0
  );

  return numerator / (denominatorX * denominatorY);
}
function interpretCorrelation(r: number): string {
  const absR = Math.abs(r); // Use absolute value since strength is the same for positive/negative correlation

  if (absR >= 0.9) {
    return "Very Strong";
  } else if (absR >= 0.7) {
    return "Strong";
  } else if (absR >= 0.5) {
    return "Moderate";
  } else if (absR >= 0.3) {
    return "Weak";
  } else {
    return "Very Weak or No Correlation";
  }
}

export const useCarbonCorrelation = (data: EnergyUsage[]) => {
  const correlation = pearsonCorrelation(
    data.map((d) => d.usage_non_clean),
    data.map((d) => d.co2_impact)
  );
  const correlationLabel = interpretCorrelation(correlation);
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: html`<h2>
        Correlation between Non-Clean Energy and Carbon Footprint:
        <b>${correlation.toFixed(2)} (${correlationLabel})</b>
        <h2></h2>
      </h2>`,
      width,
      height: height - 32,
      marginTop: 32,
      marginLeft: 48,
      marginBottom: 48,
      x: {
        grid: true,
        label: "Non-clean energy (MW)",
        tickFormat: ".2s",
        nice: true,
      },
      y: {
        grid: true,
        label: "Co2 (g)",
        tickFormat: ".2s",
        nice: true,
      },
      marks: [
        Plot.dot(data, {
          x: "usage_non_clean",
          y: "co2_impact",
          stroke: "#728698",
          tip: true,
          title: (d) => `Date: ${d3.timeFormat("%d %b %Y")(
            new Date(d.timestamp_date)
          )}
          \nUsage: ${d3.format(".2s")(d.usage_non_clean)} MW
          \nImpact: ${d3.format(".2s")(d.co2_impact)} g`,
        }),
        ,
        Plot.linearRegressionY(data, {
          x: "usage_non_clean",
          y: "co2_impact",
          stroke: "#cbefe2",
        }),
      ],
    });

  const legend = html`<div
    class="legendItem-swatches-wrap"
    style="gap: 32px; justify-content: center;"
  >
    <div class="legendItem-swatch">
      <svg width="16" height="12">
        <line x1="0" y1="6" x2="16" y2="6" stroke="#cbefe2" stroke-width="2" />
      </svg>
      Linear Regression
    </div>
    <div class="legendItem-swatch">
      <svg width="16" height="16">
        <circle cy="8" cx="8" stroke="#748899" fill="none" r="3" />
      </svg>
      Data
    </div>
  </div>`;

  return [plot, legend];
};
