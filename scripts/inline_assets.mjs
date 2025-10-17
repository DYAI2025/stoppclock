import fs from "fs/promises";
import path from "path";

const distDir = path.resolve("dist");
const indexFile = path.join(distDir, "index.html");

function toAbs(p) {
  if (/^https?:\/\//i.test(p)) return null;            // externe URLs nicht inlinen
  return p.startsWith("/") ? path.join(distDir, p.slice(1)) : path.join(distDir, p);
}

const readText  = (p) => fs.readFile(p, "utf8");
const writeText = (p, s) => fs.writeFile(p, s, "utf8");

const SCRIPT_RE = /<script\s+[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/i;
const CSS_RE    = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i;

const info=(...a)=>console.log("[inline]",...a);
const warn=(...a)=>console.warn("[inline][WARN]",...a);

function escapeInlineJS(js) {
  return js
    .replace(/<\/script/gi, "<\\/script>")
    .replace(/<!--/g, "<\\!-->");
}
function escapeInlineCSS(css) {
  return css.replace(/<\/style/gi, "<\\/style>");
}

(async () => {
  let html = await readText(indexFile);

  const sMatch = html.match(SCRIPT_RE);
  if (sMatch) {
    const src = sMatch[1];
    const abs = toAbs(src);
    if (abs) {
      const jsRaw = await readText(abs);
      const js = escapeInlineJS(jsRaw);
      html = html.replace(SCRIPT_RE, `<script type="module">\n${js}\n</script>`);
      info("Entry JS inlined:", src);
    } else {
      warn("Externes Script, nicht inlined:", src);
    }
  } else {
    warn('Kein <script type="module" src="..."> gefunden.');
  }

  const cMatch = html.match(CSS_RE);
  if (cMatch) {
    const href = cMatch[1];
    const abs = toAbs(href);
    if (abs) {
      try {
        const cssRaw = await readText(abs);
        const css = escapeInlineCSS(cssRaw);
        html = html.replace(CSS_RE, `<style>\n${css}\n</style>`);
        info("CSS inlined:", href);
      } catch (e) {
        warn("CSS nicht lesbar (skip):", href, String(e?.message||e));
      }
    } else {
      warn("Externes Stylesheet, nicht inlined:", href);
    }
  }

  await writeText(indexFile, html);

  const headPreview = html.split("</script>")[0].split("\n").slice(-2).join("\n");
  info("Inline preview (tail of <script>):\n" + headPreview);

  info("index.html aktualisiert:", indexFile);
})().catch((e)=>{ console.error("[inline][FAIL]", e); process.exit(2); });
