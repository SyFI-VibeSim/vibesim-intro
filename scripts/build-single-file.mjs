import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDirectory = path.join(projectDirectory, "dist");
const outputFile = path.join(outputDirectory, "vibesim-intro.html");

// Inline binary assets during Vite's build, then fold emitted CSS and JS into HTML.
await build({
  root: projectDirectory,
  // The published site sets base to its subpath, but this file is meant to be
  // opened straight from disk, where a root-absolute URL resolves to the
  // filesystem root. Relative paths keep it self-contained.
  base: "./",
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
  },
});

let html = await readFile(path.join(outputDirectory, "index.html"), "utf8");

const resolveOutputAsset = (assetReference) =>
  path.join(outputDirectory, assetReference.replace(/^\.?\//, ""));

const stylesheetPattern = /<link rel="stylesheet" crossorigin href="([^"]+)">/g;
for (const stylesheetMatch of [...html.matchAll(stylesheetPattern)]) {
  const stylesheet = await readFile(resolveOutputAsset(stylesheetMatch[1]), "utf8");
  html = html.replace(stylesheetMatch[0], () => `<style>${stylesheet}</style>`);
}

const moduleScriptStart = html.indexOf('<script type="module"');
if (moduleScriptStart >= 0) {
  const moduleScriptOpeningEnd = html.indexOf(">", moduleScriptStart);
  const moduleScriptClosingEnd =
    html.indexOf("</script>", moduleScriptOpeningEnd) + "</script>".length;
  const moduleScriptTag = html.slice(moduleScriptStart, moduleScriptClosingEnd);
  const sourceMarkerStart = moduleScriptTag.indexOf('src="') + 'src="'.length;
  const sourceMarkerEnd = moduleScriptTag.indexOf('"', sourceMarkerStart);
  const moduleScriptReference = moduleScriptTag.slice(
    sourceMarkerStart,
    sourceMarkerEnd,
  );
  const moduleScript = await readFile(
    resolveOutputAsset(moduleScriptReference),
    "utf8",
  );
  const safeModuleScript = moduleScript.replaceAll("</script", "<\\/script");
  html = html.replace(
    moduleScriptTag,
    () => `<script type="module">${safeModuleScript}</script>`,
  );
}

const externalAssetTag = html.match(
  /<(?:script|link|img)\b[^>]*\b(?:src|href)="\.?\/assets\//,
);
if (externalAssetTag) {
  throw new Error(
    `Single-file build still contains an external asset reference: ${externalAssetTag[0]}`,
  );
}

await writeFile(outputFile, html, "utf8");
console.log(`Single-file build written to ${outputFile}`);
