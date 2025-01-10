import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

// Calendar Component
export function Calendar(
  data = [],
  {
    date = (d) => (typeof d === "object" && "date" in d ? d.date : d[0]),
    value = (d) => (typeof d === "object" && "value" in d ? d.value : d[1]),
    reduce = (d) => d[0],
    width = 726,
    gap = 0.15,
    color,
    fill = value || "steelblue",
    textFill = "white",
    title,
    colors = { base: "#eee", today: "red" },
    weekStart = 0,
    daysToShow = d3.range(7).map((d) => (d + +weekStart) % 7),
    weekNumber,
    locale = "en-US",
    weekNumberFormat = +weekStart === 0 ? "%U" : "%W",
    dayFormat = (d) =>
      d.toLocaleString(locale, { weekday: "narrow", timeZone: "UTC" }),
    monthFormat = (d) =>
      d.toLocaleString(locale, { month: "short", timeZone: "UTC" }),
    fy,
  } = {}
) {
  // Helper: UTC Weekday
  function utcWeekday(i) {
    return d3.timeInterval(
      (date) => {
        date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 7 - i) % 7));
        date.setUTCHours(0, 0, 0, 0);
      },
      (date, step) => date.setUTCDate(date.getUTCDate() + step * 7),
      (start, end) => (end - start) / 604800000
    );
  }

  // Process Data
  const dates = Plot.valueof(data, date);
  const marked = d3.rollup(data, reduce, (d, i) =>
    dates[i] instanceof Date ? dates[i] : d3.isoParse(dates[i])
  );
  const days = [...marked.keys()].filter((d) => !isNaN(d.getTime()));
  if (days.length === 0) days.push(new Date());
  const e = d3.extent(days);

  // Responsive Settings
  const W = width < 726 ? "H" : "Y";
  const fullExtent = [
    d3.utcYear.floor(e[0]),
    d3.utcYear.offset(d3.utcYear.floor(e[1])),
  ];
  if (W === "H") {
    if (e[0].getUTCMonth() >= 6)
      fullExtent[0] = d3.utcMonth.offset(fullExtent[0], 6);
    if (e[1].getUTCMonth() < 6)
      fullExtent[1] = d3.utcMonth.offset(fullExtent[1], -6);
  }
  const alldays = new Set([...days, ...d3.utcDays(...fullExtent)]);

  data = Array.from(alldays, (date) => ({
    date,
    ...(marked.has(date)
      ? { ...marked.get(date), date, foreground: true }
      : { background: true }),
  }));

  const utcWeek = utcWeekday(+weekStart);
  if (typeof weekNumberFormat === "string")
    weekNumberFormat = d3.utcFormat(weekNumberFormat);

  const weekX =
    W === "H"
      ? (d) =>
          +utcWeek.count(d3.utcYear(d), d) -
          26.2 * (d.getUTCMonth() >= 6) +
          gap * d.getUTCMonth()
      : (d) => +utcWeek.count(d3.utcYear(d), d) + gap * +d.getUTCMonth();
  const height =
    (d3.utcMonths(...d3.extent(alldays)).length / 12) *
    (daysToShow.length + 2) *
    17 *
    (W === "H" ? 2 : 1);

  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  const barOptions = {
    x1: (d) => -0.45 + weekX(d.date),
    x2: (d) => 0.5 + weekX(d.date),
    y: (d) => d.date.getUTCDay(),
    insetBottom: 1,
  };
  const textOptions = {
    x: (d) => weekX(d.date),
    y: (d) => d.date.getUTCDay(),
    text: (d) => d.date.getUTCDate(),
    fontSize: 8,
    pointerEvents: "none",
  };

  if (title === undefined) {
    const values = Plot.valueof(data, value);
    const format = d3.format("~f");
    const formatValue = (d) => (typeof d === "number" ? format(d) : d);
    title = Plot.valueof(data, (d, i) =>
      d.foreground
        ? `${new Intl.DateTimeFormat(locale, { timeZone: "UTC" }).format(
            d.date
          )}: ${formatValue(values[i])}`
        : undefined
    );
  }

  const p = Plot.plot({
    width,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: W === "H" ? 70 : 40,
    height,
    facet: {
      data,
      y:
        W === "H"
          ? (d) =>
              `${d.date.getUTCFullYear()} H${
                d.date.getUTCMonth() < 6 ? "1" : "2"
              }`
          : (d) => `${d.date.getUTCFullYear()}`,
    },
    y: {
      domain: weekNumber ? [-2, -1, ...daysToShow] : [-1, ...daysToShow],
      tickFormat: (day) =>
        day < 0 ? "" : dayFormat(d3.isoParse(`2000-02-2${day}`)),
      tickSize: 0,
    },
    x: { axis: null },
    fy: { reverse: true, axis: null, ...fy },
    color,
    marks: [
      [
        colors.base &&
          Plot.barX(data, {
            filter: "background",
            ...barOptions,
            fill: colors.base,
          }),
        Plot.barX(data, {
          filter: "foreground",
          ...barOptions,
          fill,
          title,
        }),
        colors.today &&
          Plot.barX(data, {
            filter: (d) => +d.date === +today,
            ...barOptions,
            fill: "none",
            stroke: colors.today,
          }),
      ],
      [
        Plot.text(data, {
          filter: "background",
          ...textOptions,
          fill: "black",
        }),
        Plot.text(data, {
          filter: "foreground",
          ...textOptions,
          fill: textFill,
        }),
      ],
      [
        Plot.text(
          data,
          Plot.selectMinX({
            filter: (d) => d.date.getUTCDay() === weekStart,
            x: (d) => weekX(d.date),
            y: weekNumber ? -2 : -1,
            text: (d) => monthFormat(d.date),
            z: (d) => d.date.getUTCMonth(),
          })
        ),
        Plot.text(
          data,
          Plot.selectFirst({
            sort: "date",
            x: 0,
            y: weekNumber ? -2 : -1,
            text:
              W === "H"
                ? (d) =>
                    d.date.getUTCFullYear() +
                    (d.date.getUTCMonth() < 6 ? " H1" : "H2")
                : (d) => `${d.date.getUTCFullYear()}`,
            textAnchor: "end",
            fontWeight: "bold",
            dx: -14,
          })
        ),
      ],
      weekNumber
        ? Plot.text(
            data,
            Plot.selectFirst({
              filter: (d) => d.date.getUTCDay() === (weekStart + 6) % 7,
              x: (d) => weekX(d.date),
              y: -1,
              text: (d) => weekNumberFormat(d.date),
              fontSize: 7,
              fill: "grey",
              z: (d) => weekNumberFormat(d.date),
            })
          )
        : null,
    ],
  });

  const style = document.createElement("style");
    style.textContent = `.plot text { pointer-events: none }`;
    p.appendChild(style);
  return p;
}
