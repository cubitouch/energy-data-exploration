import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { timeAxisOptions } from "../utils/formats.js";

interface EnergyUsage {
  timestamp_date: string;
  import_england: number;
  import_spain: number;
  import_italy: number;
  import_swiss: number;
  import_germany_belgium: number;
}
export const useExchangeBreakdown = (
  timePeriod: number,
  data: EnergyUsage[]
) => {
  const energyExchange = data.flatMap((d: EnergyUsage) => [
    {
      timestamp_date: d.timestamp_date,
      usage: d.import_england,
      source: "England",
    },
    {
      timestamp_date: d.timestamp_date,
      usage: d.import_spain,
      source: "Spain",
    },
    {
      timestamp_date: d.timestamp_date,
      usage: d.import_italy,
      source: "Italy",
    },
    {
      timestamp_date: d.timestamp_date,
      usage: d.import_swiss,
      source: "Swiss",
    },
    {
      timestamp_date: d.timestamp_date,
      usage: d.import_germany_belgium,
      source: "Germany and Belgium",
    },
  ]);

  const plotExchange = (width, height) =>
    Plot.plot({
      title: "Energy Exchanges",
      width,
      height: height - 64,
      x: { ...timeAxisOptions(timePeriod) },
      y: {
        grid: true,
        label: "Import",
        tickFormat: ".2s",
      },
      color: {
        domain: ["England", "Spain", "Italy", "Swiss", "Germany and Belgium"],
        range: d3.schemeTableau10,
        legend: false, // Disable the integrated legend
      },
      marks: [
        Plot.barY(
          energyExchange,
          Plot.stackY({
            x: "timestamp_date",
            y: "usage",
            fill: "source",
            tip: true,
            title: (d: (typeof energyExchange)[0]) => `Date: ${d3.timeFormat(
              "%d %b %Y"
            )(new Date(d.timestamp_date))}
                \n${d.source}: ${d3.format(".2s")(d.usage)} MW`,
          })
        ),
      ],
    });
  const legendExchanges = Plot.legend({
    color: {
      domain: ["England", "Spain", "Italy", "Swiss", "Germany and Belgium"],
      range: d3.schemeTableau10,
    },
    label: "Energy Sources",
    swatchSize: 16,
    className: "legendItem",
  });

  return [plotExchange, legendExchanges] as const;
};
