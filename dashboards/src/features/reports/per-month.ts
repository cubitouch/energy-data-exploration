import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Report {
  report_month: string;
  count: number;
}
export const usePerMonth = (data: Report[]) => {
  const plot = (width: number, height: number) =>
    Plot.plot({
      title: "How many Energy Performance reports since June 2021?",
      width,
      height: height - 48,
      marginTop: 32,
      marginLeft: 32,
      x: {
        tickRotate: -45,
        label: "",
        nice: true,
        tickFormat: "%B %Y",
      },
      y: {
        label: "Reports",
        grid: true,
        tickFormat: "2s",
        nice: true,
      },
      marks: [
        Plot.areaY(data, {
          x: "report_month",
          y: "count",
          stroke: "#748899",
          fill: "#748899",
          tip: true,
          title: d => `${d3.utcFormat("%B %Y")(d.report_month)}: ${d3.format(".2s")(d.count)} reports`,
        }),
      ],
    });


  return [plot] as const;
};
