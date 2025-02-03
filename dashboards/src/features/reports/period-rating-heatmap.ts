import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Summary {
  construction_period: string;
  dpe_label: string;
  ratio: number;
}
export const usePeriodRatingHeatmap = (data: Summary[]) => {
  // Ensure all construction_period and dpe_label combinations exist
  const allPeriods = [
    "before 1948",
    "1948-1974",
    "1975-1977",
    "1978-1982",
    "1983-1988",
    "1989-2000",
    "2001-2005",
    "2006-2012",
    "2013-2021",
    "after 2021",
  ];
  const allLabels = ["A", "B", "C", "D", "E", "F", "G"];

  // Create a full grid and fill missing cells with ratio: 0
  const fullData = allPeriods.flatMap((period) =>
    allLabels.map((label) => {
      const found = data.find(
        (d) => d.construction_period === period && d.dpe_label === label
      );
      return (
        found || { construction_period: period, dpe_label: label, ratio: 0 }
      );
    })
  );
  // Define the color scale
  const colorScale = d3
    .scaleLinear()
    .domain([0, 0.25, 0.5, 0.75, 1])
    .range(["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"])
    .interpolate(d3.interpolateRgb);

  // Function to determine contrast color (white or black) based on cell background
  const getContrastColor = (ratio) => {
    const bgColor = d3.color(colorScale(ratio)); // Get color from scale
    const brightness =
      bgColor.r * 0.299 + bgColor.g * 0.587 + bgColor.b * 0.114; // Standard luminance formula
    return brightness > 150 ? "#000" : "#FFF"; // If bright, use black text; otherwise, use white
  };

  const plot = (width, height) =>
    Plot.plot({
      width,
      height: height - 32,
      marginLeft: 64,
      title: "Which period has the most efficient ground floor properties?",
      marks: [
        Plot.cell(fullData, {
          x: "dpe_label",
          y: "construction_period",
          fill: "ratio",
          tip: true,
          title: (d: Summary) =>
            `${d.construction_period}
          \n${d3.format(".1%")(d.ratio)} of ${d.dpe_label} ratings`,
        }),
        Plot.text(fullData, {
          x: "dpe_label",
          y: "construction_period",
          text: (d) => `${d3.format(".1%")(d.ratio)}`,
          fill: (d) => getContrastColor(d.ratio),
        }),
      ],
      color: {
        type: "linear",
        range: d3.quantize(colorScale, 20),
        label: "%",
      },
      x: {
        label: "",
        domain: allLabels,
        type: "band",
        padding: 0.05,
      },
      y: {
        label: "",
        domain: allPeriods,
        type: "band",
        padding: 0.1,
      },
    });

  const legend = plot(0, 84).legend("color", {
    tickFormat: ".0%",
  });

  return [plot, legend];
};
