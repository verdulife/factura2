const { writeFileSync } = require("fs");
const { join } = require("path");

const name = process.argv[2];

const component = `
<script>
  import { l } from "../_helpers/stores";
  import { content } from "./${name}.content";

  const ui = content[$l];
</script>

<h1>{ui.title}</h1>

<style lang="scss">
  h1 {
    margin-bottom: 1em;
  }
</style>

`;

const content = `
export const content = {
  es: {
    title: "${name}",
  },
  en: {
    title: "${name}",
  },
};
`;

const labelWithTime = " Done in";
console.time(labelWithTime);

console.log(" 🔥\x1b[31m Cooking files...\x1b[0m");
console.log(" ");

writeFileSync(join(__dirname, "..", "src", "routes", "_components", `${name}.svelte`), component, { encoding: "utf8" });
writeFileSync(join(__dirname, "..", "src", "routes", "_components", `${name}.content.js`), content, { encoding: "utf8" });

console.log(" ✔ New component:\x1b[32m", `${name}`);
console.log("\x1b[0m", "✔ Content file created");
console.log("\x1b[34m");
console.timeEnd(labelWithTime);
