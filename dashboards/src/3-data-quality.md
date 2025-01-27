---
toc: false
---

# Data Quality

---

## Why?

The value of reporting on data of poor quality is very low.<br/>
More often than not vizualizing data (even of technical nature), instead of glancing at its tabular representation, facilitates finding data quality issues.

---

## 96 Expected data point per day

```js
const dataQuality = FileAttachment("data/data-quality.csv").csv({
  typed: true,
});
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${
      resize((width, height) =>
        Plot.plot({
          width,
          padding: 0,
          facet: {
            data: dataQuality,
            y: (d) => d.timestamp_date.getUTCFullYear().toString(),
          },
          x: { axis: null },
          y: { tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0 },
          marks: [
            Plot.cell(dataQuality, {
              x: (d) => d3.utcWeek.count(d3.utcYear(d.timestamp_date), d.timestamp_date),
              y: (d) => d.timestamp_date.getUTCDay(),
              fill: (d) => d.count == 96 ? "#748899" : "#cbefe2",
              tip: true,
              title: (d) => `${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))} - ${d.count}/96 datapoints`,
              inset: 0.5,
            }),
            Plot.text(dataQuality, {
              x: (d) => d3.utcWeek.count(d3.utcYear(d.timestamp_date), d.timestamp_date),
              y: (d) => d.timestamp_date.getUTCDay(),
              text: (d) => d3.timeFormat("%d")(new Date(d.timestamp_date)),
              fill: (d) => d.count == 96 ? "white" : "#384259",
              textAnchor: "middle",
              dy: 0.35,
            }),
          ],
        })
      )
    }
  </div>
</div>
