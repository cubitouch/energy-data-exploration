// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Energy Market France",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: `
    <link rel="icon" href="favicon.ico" type="image/png" sizes="48*48">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Titillium+Web"
    />
    <style>

    * {
      font-family: "Titillium Web", sans-serif;
    }
    :root {
      --theme-background-b: #282f40;
      --theme-background-a:rgb(36, 43, 58);
      --theme-foreground-focus: #cbefe2;
    }
    button, input, textarea {
        accent-color: var(--theme-foreground-focus);
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
    .legendItem-swatch {
      height: 32px;
    }
    h2 {
      margin-bottom: 1rem;
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
