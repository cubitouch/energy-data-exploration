import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export function energyUsageHeatmap(
  usageHeatmap: any[],
  width: number,
  height: number
) {
  // Create a tooltip container
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.background = "rgb(56, 66, 89)";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "5px";
  tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  tooltip.style.fontFamily = "sans-serif";
  tooltip.style.fontSize = "12px";
  tooltip.style.lineHeight = "1.4";
  tooltip.style.visibility = "hidden";
  document.body.appendChild(tooltip);

  // Create the heatmap
  const plot = Plot.plot({
    width,
    height: height - 32,
    title: "Energy usage over the week last month",
    marks: [
      Plot.cell(usageHeatmap, {
        x: "hour",
        y: "day_of_week",
        fill: "usage",
      }),
    ],
    color: {
      type: "linear",
      range: d3.quantize(
        d3
          .scaleLinear()
          .domain([0, 0.5, 0.75, 0.9, 1]) // Relative positions for the colors
          .range(["#384259", "#748899", "#cbefe2", "#ebf9f4", "#ffffff"]) // Start, middle, and end colors
          .interpolate(d3.interpolateRgb),
        20
      ), // Use RGB interpolation
      label: "Average Usage",
    },
    x: {
      label: "",
      tickFormat: (d) => `${d}:00`, // Format hours as "0:00", "1:00", etc.
      domain: [...Array(24).keys()].map((t) => t.toString()), // Ensure hours are ordered from 0 to 23
      type: "band",
    },
    y: {
      label: "",
      tickFormat: (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
      domain: ["1", "2", "3", "4", "5", "6", "0"], // Ensure Monday (1) to Sunday (0) order
      type: "band",
    },
  });

  // Attach event listeners to cells after rendering
  const cells = plot.querySelectorAll("rect"); // Select cells (SVG rect elements)
  cells.forEach((cell, i) => {
    const data = usageHeatmap[i]; // Match data to each cell
    cell.addEventListener("pointerenter", (event) => {
      tooltip.style.visibility = "visible";
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
      tooltip.innerHTML = `
        ${
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][data.day_of_week]
        } ${data.hour}:00 - ${Number(data.hour) + 1}:00<br>
        <strong>Usage:</strong> ${Number(data.usage).toFixed(2)}
      `;
    });
    cell.addEventListener("pointerleave", () => {
      tooltip.style.visibility = "hidden";
    });
  });

  return plot;
}
