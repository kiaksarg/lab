// Reads reports/<slug>/ folders, validates them and returns listing data.
// Used by the Vite plugin (dev + build) and by `npm run check`.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

export const STATUSES = ["draft", "review", "final", "archived"];
const SLUG = /^\d{4}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const RESERVED = new Set(["assets", "index.html"]);
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const MAX_MB = 15;

/** @param {string} root project root */
export function collectReports(root) {
  const dir = path.join(root, "reports");
  const errors = [];
  const warnings = [];
  const reports = [];

  const slugs = existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];

  for (const slug of slugs) {
    const at = (msg) => `reports/${slug}: ${msg}`;
    const folder = path.join(dir, slug);
    if (RESERVED.has(slug)) { errors.push(at(`"${slug}" is reserved by the site build`)); continue; }
    if (!SLUG.test(slug)) errors.push(at("folder name must look like 2026-10-short-name (lowercase, hyphens)"));

    const htmlPath = path.join(folder, "index.html");
    if (!existsSync(htmlPath)) { errors.push(at("missing index.html")); continue; }
    const html = readFileSync(htmlPath, "utf8");
    const sizeMb = statSync(htmlPath).size / 1e6;
    if (sizeMb > MAX_MB) warnings.push(at(`index.html is ${sizeMb.toFixed(1)} MB; large pages load slowly`));

    const emails = [...new Set(html.match(EMAIL) ?? [])];
    if (emails.length) {
      warnings.push(at(`contains email addresses (${emails.slice(0, 3).join(", ")}${emails.length > 3 ? ", …" : ""}). Check that no personal data is published without a lawful basis.`));
    }

    let meta = {};
    const metaPath = path.join(folder, "meta.json");
    if (existsSync(metaPath)) {
      try { meta = JSON.parse(readFileSync(metaPath, "utf8")); }
      catch (e) { errors.push(at(`meta.json is not valid JSON (${e.message})`)); continue; }
    } else {
      warnings.push(at("no meta.json; using the page <title> and marking it as a draft"));
    }

    const title = meta.title ?? html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? slug;
    const summary = meta.summary ?? html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "";
    const date = meta.date ?? `${slug.slice(0, 7)}-01`;
    const status = meta.status ?? "draft";
    const tags = meta.tags ?? [];

    if (!DATE.test(date)) errors.push(at(`date "${date}" must be YYYY-MM-DD`));
    if (!STATUSES.includes(status)) errors.push(at(`status must be one of ${STATUSES.join(", ")}`));
    if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) errors.push(at("tags must be a list of strings"));
    if (meta.thumb && !existsSync(path.join(folder, meta.thumb))) errors.push(at(`thumb "${meta.thumb}" not found`));
    if (!meta.aiAssisted && meta.aiAssisted !== false) {
      warnings.push(at('no "aiAssisted" note; say how the page was made (or set it to false if no AI was used)'));
    }

    reports.push({
      slug,
      title,
      summary,
      date,
      project: meta.project ?? "",
      tags,
      status,
      aiAssisted: typeof meta.aiAssisted === "string" ? meta.aiAssisted : "",
      listed: meta.listed !== false,
      thumb: meta.thumb ?? "",
    });
  }

  reports.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return { reports, errors, warnings };
}
