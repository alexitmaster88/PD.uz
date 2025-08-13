import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, "reports", "image-report.csv");
const PUBLIC_DIR = path.join(ROOT, "public");

// Ensure dirs exist
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// Normalize section names from CSV (avoid ".tsx" folders, spaces, etc.)
function cleanSection(section) {
  if (!section) return "misc";
  // drop file extensions like ".tsx", ".ts", ".js", ".jsx"
  const noExt = section.replace(/\.[^.]+$/g, "");
  // common component-file sections like "benefits-section" -> "benefits"
  const simplified = noExt.replace(/-section$/i, "");
  // final slug
  return slug(simplified);
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function uniqPath(dir, base) {
  let p = path.join(dir, base);
  if (!fs.existsSync(p)) return p;
  const ext = path.extname(base);
  const name = path.basename(base, ext);
  let i = 1;
  while (true) {
    p = path.join(dir, `${name}-${i}${ext}`);
    if (!fs.existsSync(p)) return p;
    i++;
  }
}

function guessFileName(url) {
  try {
    const u = new URL(url);
    const raw = path.basename(u.pathname) || "image";
    const dec = decodeURIComponent(raw);
    const withExt = /\.(png|jpe?g|svg|webp|gif)$/i.test(dec) ? dec : `${dec}.png`;
    return slug(withExt);
  } catch {
    const base = url.split("/").pop() || "image.png";
    return slug(/\.(png|jpe?g|svg|webp|gif)$/i.test(base) ? base : `${base}.png`);
  }
}

function parseCsvLine(line) {
  // basic CSV split, covering commas inside URLs we encoded as %2C
  const parts = line.split(",");
  if (parts.length < 6) return null;
  const [file, lineNo, section, kind, url, isLocal] = parts;
  return { file, line: Number(lineNo), section, kind, url: url.replace(/%2C/g, ","), isLocal: isLocal === "yes" };
}

const rows = fs
  .readFileSync(CSV_PATH, "utf8")
  .split(/\r?\n/)
  .slice(1) // drop header
  .map(parseCsvLine)
  .filter(Boolean)
  .filter(r => !r.isLocal && /^https?:\/\//i.test(r.url)); // external only

// Deduplicate identical URL/section pairs
const key = r => `${r.section}::${r.url}`;
const map = new Map();
for (const r of rows) if (!map.has(key(r))) map.set(key(r), r);

const unique = [...map.values()];
console.log(`Downloading ${unique.length} external image(s)...`);

const fetchImg = async (url, destDir) => {
  fs.mkdirSync(destDir, { recursive: true });
  const name = guessFileName(url);
  const dest = uniqPath(destDir, name);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return dest;
};

const results = [];
let ok = 0, fail = 0;

for (const r of unique) {
  const destDir = path.join(PUBLIC_DIR, cleanSection(r.section));
  try {
    const savedPath = await fetchImg(r.url, destDir);
    const publicPath = "/" + path.relative(PUBLIC_DIR, savedPath).split(path.sep).join("/");
    results.push({ ...r, localPublicPath: publicPath });
    ok++;
    console.log(`✔ ${publicPath}  ←  ${r.url}`);
  } catch (e) {
    fail++;
    console.warn(`✖ Failed: ${r.url} (${e.message})`);
  }
}

fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "reports", "image-downloads.json"), JSON.stringify(results, null, 2));
console.log(`Done. OK: ${ok}, Failed: ${fail}. Map written to reports/image-downloads.json`);