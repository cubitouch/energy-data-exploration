import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Summary {
  is_ground_floor: number;
  abc_rating_group: number;
  others_rating_group: number;
}
export const useRatingsPerFloor = (data: Summary[]) => {
  const pivotData = data.flatMap((d: Summary) => [
    {
      position: d.is_ground_floor ? "Ground floor" : "Other floors",
      count: d.abc_rating_group / (d.abc_rating_group + d.others_rating_group),
      source: "A, B, C",
    },
    {
      position: d.is_ground_floor ? "Ground floor" : "Other floors",
      count:
        d.others_rating_group / (d.abc_rating_group + d.others_rating_group),
      source: "Others",
    },
  ]);

  const options: Plot.PlotOptions = {
    title: "How efficient are ground floor properties?",
    marginTop: 32,
    marginLeft: 48,
    x: {
      axis: null,
    },
    y: {
      label: "",
      grid: true,
      tickFormat: "%",
      nice: true,
    },
    color: {
      domain: ["A, B, C", "Others"],
      range: ["#cbefe2", "#748899"],
    },
    facet: {
      x: "position",
      marginBottom: 16,
      data: pivotData,
      label: "",
    },
    marks: [
      Plot.barY(pivotData, {
        x: "source",
        y: "count",
        fill: "source",
        tip: true,
        title: (d) =>
          `${d.position}: ${d3.format(".0%")(d.count)} reports (${d.source})`,
      }),
    ],
  };

  const plot = (width: number, height: number) =>
    Plot.plot({ ...options, width, height: height - 48 });

  const legend = Plot.legend(options);

  return [plot, legend] as const;
};
