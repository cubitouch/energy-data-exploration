---
toc: false
---

# Data Quality

---

## Why?

The value of reporting on data of poor quality is very low.<br/>
More often than not vizualizing data (even of technical nature), instead of glancing at its tabular representation, facilitates finding data quality issues.

---

## Number of data point per day

```js
const dataQuality = FileAttachment("data/data-quality.csv").csv();
import { Calendar } from "./components/calendar.js";
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">
    ${
      resize((width, height) =>
        Calendar(dataQuality, {
          width,
          date: (d) => new Date(d.timestamp_date),
          value: "count",
          // 96 times 15 minutes per day
          fill: (d) => d.count == 96 ? "#748899" : "#cbefe2",
          textFill: (d) => d.count == 96 ? "white" : "black",
          color: {
            scheme: "RdYlBu", // Color scheme
            domain: [0, 1000], // Define the domain for the color scale
            type: "sqrt", // Use a square root scale for better distribution
          },
          colors: {
            base: "#eee", // Background cell color
            today: "#eee", // Custom color for today's date
          },
          title: d => `${d3.timeFormat("%d %b %Y")(new Date(d.timestamp_date))} - ${d.count}/96 datapoints`,
        })
      )
    }
  </div>
</div>
