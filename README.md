# Lab

Interactive visualisations, exploratory dashboards and working documents from my research.

**Live site:** [arashg.dev/lab](https://arashg.dev/lab/)

Each entry is a self-contained HTML page, published as-is. A small Vite + React + TypeScript
homepage lists them, with filters by project and a status and provenance note on every card.

## Structure

```
lab/
├── entries/                  one folder per entry
│   └── scoping-review-roadmap/
│       ├── index.html        the entry (self-contained HTML)
│       ├── meta.json         title, date, status, provenance
│       └── thumb.png         optional card image (16:9)
├── src/                      homepage
├── scripts/                  validation and scaffolding
└── vite.config.ts            base path, entry list, dev routing
```

## Adding an entry

```bash
npm run new -- "Screening results, round 1"
```

This creates `entries/screening-results-round-1/meta.json`. Add the page as `index.html` in the
same folder, fill in the metadata, and push. The folder name becomes the URL
(`arashg.dev/lab/screening-results-round-1/`), so choose it once.

### meta.json

| Field        | Required | Description |
|--------------|----------|-------------|
| `title`      | yes      | Shown on the card |
| `date`       | yes      | `YYYY-MM-DD`, used for sorting |
| `status`     | yes      | `draft`, `review`, `final` or `archived` |
| `aiAssisted` | yes      | How the entry was made, or `false` if no AI was used |
| `summary`    | no       | One or two sentences |
| `project`    | no       | Groups entries and adds a filter |
| `tags`       | no       | List of strings |
| `thumb`      | no       | Image file name in the entry folder |
| `listed`     | no       | `false` hides the entry from the homepage; its URL stays public |

`npm run check` validates all entries; the build fails on errors.

## Publishing principles

- **Transparency.** Every entry states its status and how it was made, including AI assistance.
  AI-drafted figures, quotes and citations are verified against their sources before an entry
  leaves `draft`.
- **No personal data.** Entries contain no information about participants, interviewees or other
  identifiable people beyond published authorship (GDPR). Git history is permanent, so this is
  checked before committing, not after.
- **Shared material only.** Unpublished data or text appears only with co-authors' agreement.

## Development

```bash
npm install
npm run dev       # http://localhost:5173/lab/
npm run build     # validate, typecheck, build to dist/
npm run preview
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages via GitHub Actions. The site inherits the
`arashg.dev` domain from the user site, so no CNAME file is needed here.

## License

Code: [Apache-2.0](LICENSE). Entry content: © Arash Goodarzi unless stated otherwise.