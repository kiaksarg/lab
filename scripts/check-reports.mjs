import { collectReports } from "./reports.mjs";

const { reports, errors, warnings } = collectReports(process.cwd());
for (const w of warnings) console.warn(`warning  ${w}`);
for (const e of errors) console.error(`error    ${e}`);
const listed = reports.filter((r) => r.listed).length;
console.log(`${reports.length} report(s), ${listed} listed, ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) process.exit(1);
