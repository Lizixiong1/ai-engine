import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

pkg.main = "dist/index.js";
pkg.module = "dist/index.mjs";
pkg.types = "dist/index.d.ts";

writeFileSync("package.json", JSON.stringify(pkg, null, 2));
console.log("package.json updated for publish");
