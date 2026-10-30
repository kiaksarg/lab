// Usage: npm run new -- "Screening results, round 1"
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "Report title"');
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const name = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
const slug = `${today.slice(0, 7)}-${name}`;
const dir = `reports/${slug}`;
if (existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/meta.json`,
  JSON.stringify(
    {
      title,
      summary: "",
      date: today,
      project: "",
      tags: [],
      status: "draft",
      aiAssisted: "Drafted with Claude; reviewed by Arash Goodarzi.",
      listed: true,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Created ${dir}/meta.json. Put the HTML in ${dir}/index.html.`);
