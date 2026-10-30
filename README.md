# Lab

Working documents and visualisations from my research, served at **https://arashg.dev/lab/**.

A small Vite + React + TypeScript homepage lists every entry. The entries themselves are
self-contained HTML files that are copied to the site untouched.

```
lab/
├── entries/                  ← content: one folder per entry
│   └── scoping-review-roadmap/
│       ├── index.html        ← the entry (self-contained HTML)
│       ├── meta.json         ← listing info
│       └── thumb.png         ← optional card image (16:9)
├── src/                      ← homepage code (React)
├── scripts/                  ← entry validation + `npm run new`
├── vite.config.ts            ← base /lab/, copies entries/, builds the entry list
└── .github/workflows/        ← build + deploy to GitHub Pages on push to main
```

## Add a entry

```bash
npm run new -- "Screening results, round 1"
# → entries/screening-results-round-1/meta.json
# put the HTML in that folder as index.html, fill in meta.json, then:
git add entries && git commit -m "entry: screening results round 1" && git push
```

No terminal? On GitHub use **Add file → Upload files**, type `entries/my-entry/` before
the file name, and drop in `index.html` and `meta.json`. The site redeploys in about a minute.

The entry URL is the folder name: `arashg.dev/lab/my-entry/`. Use lowercase letters, digits and
hyphens. Pick it once: renaming a folder changes the URL and breaks links you have already shared.

### meta.json

| Field        | Required | Notes |
|--------------|----------|-------|
| `title`      | yes      | Falls back to the page `<title>` |
| `summary`    | no       | One or two sentences; falls back to the page meta description |
| `date`       | yes      | `YYYY-MM-DD`; used for sorting and shown on the card |
| `project`    | no       | Becomes a filter on the homepage |
| `tags`       | no       | List of strings |
| `status`     | yes      | `draft`, `review` (shared for feedback), `final`, `archived` |
| `aiAssisted` | yes      | How it was made, e.g. "Drafted with Claude; reviewed by Arash Goodarzi." Use `false` if no AI was used |
| `listed`     | no       | `false` hides it from the homepage but the URL still works. **This is not access control.** |
| `thumb`      | no       | File name inside the folder |

`npm run check` validates every folder. The build fails on errors and warns about missing
provenance notes or email addresses inside a page.

## Before you publish

Everything on GitHub Pages is public, including the repo history.

- No personal data about participants, interviewees or other third parties (GDPR). Authors of
  published papers are fine; screening notes or comments about named people are not. Deleting a
  file later does not remove it from git history.
- No unpublished data, text or figures that co-authors have not agreed to share.
- AI-drafted numbers, quotes and citations are checked against the source before the status
  moves past `draft`.
- Pages that must be restricted (e.g. supervisors only) need real authentication and do not belong here.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/lab/ (entries open at /lab/<slug>/ like in production)
npm run build      # check + typecheck + build to dist/
npm run preview
```

## One-time setup

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`.

The user site `kiaksarg.github.io` has the custom domain `arashg.dev`, so this repo is served at
`arashg.dev/lab/` automatically. Do not add a CNAME file here, and keep `/lab` free in the main
site's routes.
