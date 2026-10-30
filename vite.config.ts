import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { collectEntries } from "./scripts/entries.mjs";

const VIRTUAL_ID = "virtual:entries";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

// Exposes the validated entry list to the app as `virtual:entries`.
// Invalid entries fail the build (and show the error overlay in dev).
function entriesPlugin(): Plugin {
  const root = process.cwd();
  return {
    name: "lab-entries",
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return;
      const { entries, errors, warnings } = collectEntries(root);
      for (const w of warnings) this.warn(w);
      if (errors.length) this.error("Entry problems:\n" + errors.join("\n"));
      return `export default ${JSON.stringify(entries.filter((r) => r.listed))};`;
    },
    configureServer(server) {
      const entriesDir = path.join(root, "entries");
      const reload = (file: string) => {
        if (!file.startsWith(entriesDir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      // GitHub Pages serves entries/<slug>/index.html at /lab/<slug>/; mirror that in dev,
      // where Vite would otherwise fall back to the homepage.
      server.middlewares.use((req, res, next) => {
        const base = server.config.base;
        const url = (req.url ?? "").split(/[?#]/)[0];
        const m = url.startsWith(base) && url.slice(base.length).match(/^([^/]+)(\/?)$/);
        if (!m) return next();
        const file = path.join(entriesDir, decodeURIComponent(m[1]), "index.html");
        if (!existsSync(file)) return next();
        if (!m[2]) {
          res.writeHead(301, { Location: `${base}${m[1]}/` }).end();
          return;
        }
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(readFileSync(file));
      });

      server.watcher.add(entriesDir);
      server.watcher.on("add", reload).on("unlink", reload).on("change", reload).on("unlinkDir", reload);
    },
  };
}

// Served at https://arashg.dev/lab/ (a GitHub project page under the arashg.dev user site).
// entries/ is Vite's public dir: every entry folder is copied verbatim to dist/<slug>/,
// so the self-contained HTML is never touched by the bundler.
export default defineConfig({
  base: "/lab/",
  publicDir: "entries",
  plugins: [react(), entriesPlugin()],
});
