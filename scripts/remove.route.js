/* const { unlinkSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const name = process.argv[2];

const labelWithTime = " Done in";
console.time(labelWithTime);

unlinkSync(join(__dirname, "..", "src", "routes", `${name}.svelte`));
unlinkSync(join(__dirname, "..", "src", `${name}`, "content.js"));

let app = readFileSync(join(__dirname, "..", "src", "App.svelte"), { encoding: 'utf8', flag: 'r' });
let nav_component = readFileSync(join(__dirname, "..", "src", "components", "Nav.svelte"), { encoding: 'utf8', flag: 'r' });
let nav_content = readFileSync(join(__dirname, "..", "src", "content", "Nav.json"), { encoding: 'utf8', flag: 'r' });

app = app.replace(`import ${name} from "./views/${name}.svelte";\n  `, "");
app = app.replace(`<Route path="/${name.toLowerCase()}" component={${name}} />\n    `, "");
writeFileSync(join(__dirname, "..", "src", "App.svelte"), app, { encoding: "utf8" });

nav_component = nav_component.replace(`<li><a href="/${name.toLowerCase()}" use:link>{ui.${name.toLowerCase()}}</a></li>\n  `, "");
writeFileSync(join(__dirname, "..", "src", "components", "Nav.svelte"), nav_component, { encoding: "utf8" });

nav_content = nav_content.replaceAll(`,\n        "${name.toLowerCase()}": "${name}"`, "");
writeFileSync(join(__dirname, "..", "src", "content", "Nav.json"), nav_content, { encoding: "utf8" });

console.log("\x1b[31m", `❌ ${name} view`);
console.log(" ❌ Content file");
console.log("\x1b[3m");
console.timeEnd(labelWithTime);
 */