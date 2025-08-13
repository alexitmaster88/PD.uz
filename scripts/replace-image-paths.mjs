import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, "reports", "image-downloads.json");

// which files we edit
const GLOBS = [
  "app", "components", "styles", "lib", "utils", "contexts", "hooks"
];
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build", "reports", "public"]);

const FILE_RE = /\.(tsx?|jsx?|css|scss|sass|mjs|cjs|json|mdx?)$/i;

const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8")); // array [{url, localPublicPath, ...}]
const urlToLocal = new Map(map.map(x => [x.url, x.localPublicPath]));

// build a single regex to catch any of the URLs
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const urlAlternation = [...urlToLocal.keys()].map(escape).join("|");
const URL_RE = new RegExp(urlAlternation, "g");

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (IGNORE_DIRS.has(name)) continue;
      yield* walk(p);
    } else if (FILE_RE.test(name)) {
      yield p;
    }
  }
}

let touched = 0;
for (const d of GLOBS) {
  const abs = path.join(ROOT, d);
  if (!fs.existsSync(abs)) continue;
  for (const f of walk(abs)) {
    const src = fs.readFileSync(f, "utf8");
    if (!URL_RE.test(src)) continue; // quick check
    let out = src.replace(URL_RE, m => urlToLocal.get(m) || m);
    if (out !== src) {
      fs.writeFileSync(f, out, "utf8");
      touched++;
      console.log(`✎ updated: ${path.relative(ROOT, f)}`);
    }
  }
}
console.log(`Rewrites complete. Files updated: ${touched}`);