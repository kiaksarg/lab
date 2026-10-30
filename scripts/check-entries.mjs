import { collectEntries } from "./entries.mjs";

const { entries, errors, warnings } = collectEntries(process.cwd());
for (const w of warnings) console.warn(`warning  ${w}`);
for (const e of errors) console.error(`error    ${e}`);
const listed = entries.filter((r) => r.listed).length;
console.log(`${entries.length} entries, ${listed} listed, ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) process.exit(1);
