// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Energy Data Exploration",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Energy Market France",
      pages: [
        { name: "Usage", path: "/energy-usage" },
        { name: "Origin", path: "/energy-origin" },
        { name: "Carbon Impact", path: "/carbon-impact" },
        { name: "Data Quality", path: "/data-quality" },
      ],
    },
    { name: "Energy Performance Certificates", path: "/energy-performance-certificates" },
    { name: "About", path: "/about" },
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: `
    <link rel="icon" href="favicon.ico" type="image/png" sizes="48*48">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Titillium+Web"
    />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HC6CP0M5H4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-HC6CP0M5H4');
    </script>
    <style>

    * {
      font-family: "Titillium Web", sans-serif;
    }
    :root {
      --theme-background-b: #282f40;
      --theme-background-a:rgb(36, 43, 58);
      --theme-foreground-focus: #cbefe2;
    }

    h2 + p, h3 + p, h4 + p, h2 + table, h3 + table, h4 + table  {
      margin-bottom: 32px;
    }

    button, input, textarea {
        accent-color: var(--theme-foreground-focus);
    }
    footer nav {
      display: flex !important;
      justify-content: space-between;
      max-width: none !important;
    }
    footer nav a {
      border-radius: 0 !important;
    }
    .grid {
      gap: 2rem;
    }
    .card {
      border: none;
      border-radius: 0;
    }
    .observablehq--block label {
      line-height: 0.8rem;
    }
    h2 {
      margin-bottom: 1rem;
    }

    .legendItem-swatches-wrap {
      display: flex;
      font-family: sans-serif;
      font-size: 10px;
    }
    .legendItem-swatch {
      height: 32px;
      display: flex;
      align-items: center;
    }
    :where(.legendItem-swatch > svg) {
      margin-right: 0.5em;
    }

    .time-picker {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--theme-background-a);
      border-bottom: 1px solid var(--theme-background-alt);
    }
    .time-picker input {
      visibility: hidden;
      position: absolute;
    }
    .time-picker form label {
      display: inline-block;
      padding: 8px 16px;
      user-select: none;
    }
    .time-picker form div label {
      cursor: pointer;
      margin-right: 5px;
      background: var(--theme-background-alt);
    }
    .time-picker form div label:hover {
      background: #728698;
    }

    .time-picker label:has(input[type="radio"]:checked) {
      background: var(--theme-foreground-focus);
      color: var(--theme-background-alt);
    }

    </style>
  `,

  // The path to the source root.
  root: "src",

  theme: "dark",
  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
