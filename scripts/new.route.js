const { writeFileSync, readFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const name = process.argv[2];

const route = `
<script>
  import { l } from "../_helpers/stores";
  import { content } from "./_content";

  const ui = content[$l];
</script>

<svelte:head>
  <title>{ui.page}</title>
</svelte:head>

<div class="${name}">
  <h1>{ui.title}</h1>
</div>

<style lang="scss">
  .${name} {
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 1em;
  }
</style>
`;

const content = `
export const content = {
  es: {
    page: "${name}",
    title: "${name}",
  },
  en: {
    page: "${name}",
    title: "${name}",
  },
};
`;

const labelWithTime = " Done in";
console.time(labelWithTime);

console.log("🔥\x1b[31m Cooking files...\x1b[0m");
console.log(" ");

mkdirSync(join(__dirname, "..", "src", "routes", `${name.toLowerCase()}`));
writeFileSync(join(__dirname, "..", "src", "routes", `${name.toLowerCase()}`, "index.svelte"), route, { encoding: "utf8" });
writeFileSync(join(__dirname, "..", "src", "routes", `${name.toLowerCase()}`, "_content.js"), content, { encoding: "utf8" });

let nav_content = readFileSync(join(__dirname, "..", "src", "routes", "_components", "Nav.content.js"), { encoding: "utf8" });
nav_content = nav_content.replace(
  /],/g,
  `  {
        slug: "${name.toLowerCase()}",
        title: "${name}",
      },
    ],`
);

writeFileSync(join(__dirname, "..", "src", "routes", "_components", "Nav.content.js"), nav_content, { encoding: "utf8" });

console.log("✔ New route:\x1b[32m", `${name}`);
console.log("\x1b[0m", "✔ Content file created");
console.log("\x1b[34m");
console.timeEnd(labelWithTime);
