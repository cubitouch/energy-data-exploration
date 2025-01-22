import * as d3 from "d3";

export const timeAxisOptions = (days: number) => {
  const tickFormat =
    days === 90
      ? (d, i) => (i % 7 === 0 ? d3.timeFormat("%b %d")(d) : "")
      : "%b %d";
  return {
    tickRotate: -45,
    label: "",
    type: "band",
    nice: true,
    tickFormat,
  };
};
