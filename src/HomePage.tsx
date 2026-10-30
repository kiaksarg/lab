import { useMemo, useState } from "react";
import reports from "virtual:reports";
import { ReportCard } from "./ReportCard";

const SITE = "arashg.dev";

export function HomePage() {
  const [project, setProject] = useState<string>("");
  const [query, setQuery] = useState("");

  const projects = useMemo(
    () => [...new Set(reports.map((r) => r.project).filter(Boolean))].sort(),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (project && r.project !== project) return false;
      if (!q) return true;
      return [r.title, r.summary, r.project, ...r.tags].join(" ").toLowerCase().includes(q);
    });
  }, [project, query]);

  return (
    <div className="hp">
      <div className="hp-wrap">
        <header>
          <nav className="hp-crumb" aria-label="Breadcrumb">
            <a href={`https://${SITE}`}>{SITE}</a>
            <span aria-hidden="true" style={{ opacity: 0.4 }}>/</span>
            <span>lab</span>
          </nav>
          <h1 className="hp-title">Lab</h1>
          <p className="hp-sub">
            Working documents from my research: method roadmaps, review snapshots and
            interactive visualisations. Each entry says how it was made and how final it is.
          </p>
        </header>

        {reports.length > 0 && (
          <div className="hp-tools">
            {projects.length > 1 && (
              <div className="hp-filters" role="group" aria-label="Filter by project">
                <button type="button" aria-pressed={project === ""} onClick={() => setProject("")}>
                  All
                </button>
                {projects.map((p) => (
                  <button key={p} type="button" aria-pressed={project === p} onClick={() => setProject(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
            {reports.length > 6 && (
              <input
                className="hp-search"
                type="search"
                placeholder="Search"
                aria-label="Search reports"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="hp-empty">Nothing here yet.</div>
        ) : visible.length === 0 ? (
          <div className="hp-empty">
            No reports match. <button type="button" className="hp-link" onClick={() => { setProject(""); setQuery(""); }}>Show all</button>
          </div>
        ) : (
          <div className="hp-grid">
            {visible.map((r) => (
              <ReportCard key={r.slug} report={r} />
            ))}
          </div>
        )}

        <footer className="hp-foot">
          <span>© {new Date().getFullYear()} Arash Goodarzi</span>
          <a href={`https://${SITE}`}>{SITE} ↗</a>
        </footer>
      </div>
    </div>
  );
}
