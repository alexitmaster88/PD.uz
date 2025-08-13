import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INCLUDE_DIRS = ["app","components","styles","public","lib","utils","contexts","hooks"];
const EXCLUDE = new Set(["node_modules",".next",".git","dist","build"]);
const FILE_RE = /\.(tsx?|jsx?|css|scss|sass|mjs|cjs|json|mdx?)$/i;

const PATTERNS = [
  { kind: "react-image", re: /<Image[^>]*\bsrc\s*=\s*(?:{["'`](.+?)["'`]}|["'`](.+?)["'`])/g },
  { kind: "img-tag",     re: /<img[^>]*\bsrc\s*=\s*["'`](.+?)["'`]/g },
  { kind: "css-url",     re: /url\(\s*["']?([^)"']+)["']?\s*\)/g },
  { kind: "style-url",   re: /background(?:Image)?\s*:\s*["'`]url\(([^)"']+)["'`]\)/g },
  { kind: "literal-url", re: /https?:\/\/[^\s)"'`]+?\.(?:png|jpe?g|svg|webp|gif)/g },
];

const isImagePath = (s) => /\.(?:png|jpe?g|svg|webp|gif)$/i.test(s);
const sectionOf = (p) => {
  const segs = p.split(path.sep);
  for (const base of ["components","app","styles"]) {
    const i = segs.indexOf(base);
    if (i >= 0 && segs[i+1]) return segs[i+1];
  }
  return segs[segs.length-2] || "";
};

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (EXCLUDE.has(name)) continue;
      yield* walk(p);
    } else if (FILE_RE.test(name)) {
      yield p;
    }
  }
}

function findMatches(file) {
  const text = fs.readFileSync(file, "utf8");
  const rows = [];
  const push = (kind, match, idx) => {
    let url = match[1] || match[2] || match[0];
    url = String(url).replace(/^[`'"]|[`'"]$/g, "");
    if (/^data:/.test(url)) return;
    if (!(isImagePath(url) || /^https?:\/\//i.test(url) || /url\(/.test(match[0]))) return;
    const line = text.slice(0, idx).split("\n").length;
    rows.push({ file: path.relative(ROOT,file), line, kind, url, section: sectionOf(file), local: !/^https?:\/\//i.test(url) });
  };
  for (const { kind, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) push(kind, m, m.index);
  }
  return rows;
}

const all = [];
for (const d of INCLUDE_DIRS) {
  const abs = path.join(ROOT, d);
  if (fs.existsSync(abs)) for (const f of walk(abs)) all.push(...findMatches(f));
}
all.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line);

const out = [
  ["file","line","section","kind","url","isLocal"].join(","),
  ...all.map(r=>[r.file,r.line,r.section,r.kind,String(r.url).replace(/,/g,"%2C"),r.local?"yes":"no"].join(","))
].join("\n");

fs.mkdirSync(path.join(ROOT,"reports"), { recursive:true });
fs.writeFileSync(path.join(ROOT,"reports","image-report.csv"), out, "utf8");
console.log(`Found ${all.length} image reference(s). Wrote reports/image-report.csv`);
