import type { Entry, EntryStatus } from "./types";

const STATUS_LABEL: Record<EntryStatus, string> = {
  draft: "Working draft",
  review: "Shared for feedback",
  final: "Final",
  archived: "Archived",
};

const base = import.meta.env.BASE_URL;

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function EntryCard({ entry: r }: { entry: Entry }) {
  const href = `${base}${r.slug}/`;
  const tags = [...new Set([r.project, ...r.tags].filter(Boolean))];

  return (
    <a href={href} className="hp-card">
      {r.thumb && <img className="hp-thumb" src={`${href}${r.thumb}`} alt="" loading="lazy" />}
      <div className="hp-meta">
        <time dateTime={r.date}>{formatDate(r.date)}</time>
        <span className={`hp-status hp-status-${r.status}`}>{STATUS_LABEL[r.status]}</span>
      </div>
      <h2>{r.title}</h2>
      {r.summary && <p>{r.summary}</p>}
      {tags.length > 0 && (
        <ul className="hp-tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {r.aiAssisted && <p className="hp-prov">{r.aiAssisted}</p>}
      <span className="hp-open">
        Open <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}
