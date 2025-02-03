import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Summary {
  postal_code: number;
  abc_rating_group: number;
  others_rating_group: number;
}
export const useRatingsPerPostalCode = (data: Summary[]) => {
  const pivotData = data.flatMap((d: Summary) => [
    {
      postal_code: d.postal_code,
      count: d.abc_rating_group,
      source: "A, B, C",
    },
    {
      postal_code: d.postal_code,
      count: d.others_rating_group,
      source: "Others",
    },
  ]);

  const options: Plot.PlotOptions = {
    title: "Which postal codes have most A, B or C energy ratings?",
    marginTop: 32,
    marginLeft: 48,
    x: {
      tickRotate: -45,
      label: "",
      nice: true,
      domain: data
        .sort((a, b) => b.abc_rating_group - a.abc_rating_group)
        .map((d) => d.postal_code),
      tickFormat: "d",
    },
    y: {
      label: "Reports",
      grid: true,
      tickFormat: "2s",
      nice: true,
    },
    color: {
      domain: ["A, B, C", "Others"],
      range: ["#cbefe2", "#748899"],
    },
    marks: [
      Plot.barY(pivotData, {
        x: "postal_code",
        y: "count",
        fill: "source",
        tip: true,
        title: (d) =>
          `${d.postal_code}: ${d3.format(".2s")(d.count)} reports (${
            d.source
          })`,
      }),
    ],
  };

  const plot = (width: number, height: number) =>
    Plot.plot({ ...options, width, height: height - 48 });

  const legend = Plot.legend(options);

  return [plot, legend] as const;
};
