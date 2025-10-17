import fs from "fs/promises";
import path from "path";

const distDir = path.resolve("dist");
const indexFile = path.join(distDir, "index.html");

const toAbsolute = (ref) => {
  if (!ref) return null;
  if (/^https?:\/\//i.test(ref)) return null;
  if (ref.startsWith("/")) {
    return path.join(distDir, ref.slice(1));
  }
  return path.join(distDir, ref);
};

const readText = (file) => fs.readFile(file, "utf8");
const writeText = (file, value) => fs.writeFile(file, value, "utf8");

const SCRIPT_RE = /<script\s+[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/i;
const CSS_RE = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i;

function info(...args) {
  console.log("[inline]", ...args);
}

function warn(...args) {
  console.warn("[inline][WARN]", ...args);
}

(async () => {
  let html = await readText(indexFile);

  const scriptMatch = html.match(SCRIPT_RE);
  if (scriptMatch) {
    const src = scriptMatch[1];
    const abs = toAbsolute(src);
    if (abs) {
      const js = await readText(abs);
      html = html.replace(
        SCRIPT_RE,
        `<script type="module">\n${js}\n</script>`
      );
      info("Inlined entry script:", src);
    } else {
      warn("Skipped external script:", src);
    }
  } else {
    warn("No module script with src found in index.html");
  }

  const cssMatch = html.match(CSS_RE);
  if (cssMatch) {
    const href = cssMatch[1];
    const abs = toAbsolute(href);
    if (abs) {
      try {
        const css = await readText(abs);
        html = html.replace(
          CSS_RE,
          `<style>\n${css}\n</style>`
        );
        info("Inlined stylesheet:", href);
      } catch (error) {
        warn("Failed to inline stylesheet:", href, error?.message || error);
      }
    } else {
      warn("Skipped external stylesheet:", href);
    }
  }

  await writeText(indexFile, html);
  info("index.html updated with inline assets");
})().catch((error) => {
  console.error("[inline][FAIL]", error);
  process.exit(2);
});
