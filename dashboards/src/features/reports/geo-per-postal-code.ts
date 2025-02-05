import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { geojson } from "./paris-districts.geojson.js";

interface Summary {
  postal_code: number;
  abc_rating_group: number;
  others_rating_group: number;
}

export const useGeoPerPostalCode = (data: Summary[]) => {
  // Create a lookup table for postal_code -> abc_rating_group
  const dataMap = new Map(
    data.map((d) => [d.postal_code + 100, d.abc_rating_group])
  );

  // Attach abc_rating_group values to the GeoJSON features
  geojson.features.forEach((feature) => {
    const postal_code = feature.properties.c_arinsee;
    (feature.properties as any).value = dataMap.get(postal_code) || 0;
  });

  const minValue = d3.min(data, (d) => d.abc_rating_group) || 0;
  const maxValue = d3.max(data, (d) => d.abc_rating_group) || 1;

  // Define color scale
  const colorScale = d3
    .scaleLinear()
    .domain([
      minValue, // Lowest value in dataset
      minValue + (maxValue - minValue) * 0.25, // 25% percentile
      minValue + (maxValue - minValue) * 0.5, // 50% (median)
      minValue + (maxValue - minValue) * 0.75, // 75% percentile
      maxValue, // Max value
    ])
    .range(["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"])
    .interpolate(d3.interpolateRgb);

  // Render the map using Observable Plot
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "Amount of A, B and C rating per district",
      width,
      height: height - 48,
      projection: { type: "mercator", domain: geojson },
      color: {
        type: "linear",
        domain: [minValue, maxValue], // ✅ Correct domain for legend
        range: ["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"], // ✅ Directly use color range
        label: "Reports", // ✅ Adds meaningful label
        ticks: 5, // ✅ Adds 5 meaningful steps
        tickFormat: ".0s", // ✅ Removes decimal points
      },
      marks: [
        Plot.geo(geojson, {
          fill: (d) => colorScale(d.properties.value),
          stroke: "var(--theme-background)",
          tip: true,
          title: (d) =>
            `${d.properties.c_arinsee - 100 - 75_000}th District
            \n${d3.format(".2s")(d.properties.value)} reports`,
        }),
      ],
    });

  const legend = plot(0, 84).legend("color");
  return [plot, legend] as const;
};
