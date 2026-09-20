# Portfolio v2 (test / future iteration)

This is the experimental copy. The live site is `chaekim96/chaekim-portfolio`. This repo tracks the `portfolio-v2` branch there, plus a noindex so it never competes with production in search.

Sync: from the main repo, `git push v2 portfolio-v2:main --force-with-lease` (remote `v2`), then re-apply the noindex commit if needed.

---

# chaekim.dev — personal portfolio

Static site for Chae Kim: MBA candidate at UC Berkeley Haas, ex-EY AI & Data consultant, IU Informatics.

- `index.html` — home, the Stamp design (Work, Builds and About tabs). Generated: `python3 scripts/build-home.py`, which also writes `arcade.html`
- `projects/*.html` — case studies (one file per project)
- `assets/css/v-stamp.css` — the design: tokens, background gradient, light/dark, live-preview dialog
- `assets/css/case-stamp.css`, `assets/css/arcade.css` — project-page and arcade layers on top of it
- `assets/js/main.js` — theme toggle, scroll reveal, email, arcade loader; `assets/js/live.js` — "Try it live" dialog
- `scripts/stamp_shared.py` — calligraphy mark, project-page header/footer, the live-app list
- `assets/img`, `assets/pdf` — media and downloadable deliverables

No build step. Deployed on Vercel (`vercel.json` enables clean URLs so `/projects/luc` serves `projects/luc.html`).

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. Note: the Python server doesn't do clean URLs, so project links resolve to `/projects/luc.html` on Vercel but need the `.html` locally — use `npx serve .` for parity.

## Case studies

Featured / more-work pages are generated from one template: edit `scripts/build-cases.py` (content lives in the `CASES` list), run `python3 scripts/build-cases.py`, commit the HTML in `projects/`. `python3 scripts/build-cases.py --check` writes nothing and fails if a page is out of date or still has a `[CONFIRM:` tag. The page template is `SHELL` in that script. The five college pages are hand-edited HTML.

Anything not yet confirmed is marked in the copy as `[CONFIRM: ...]` (styled yellow). Grep: `grep -rn "CONFIRM:" index.html projects/`.

## Updating content

- Add a project: add an entry to `CASES` in `scripts/build-cases.py`, a card in the Stamp template in `scripts/build-home.py`, then run both scripts. Web apps that can run in a frame go in `LIVE_APPS` (stamp_shared.py) to get a "Try it live" button.
- The old design variants (desktop, PRD, notebook, schematic) were retired; `/variants/*` redirects home.
- Resume: replace `assets/pdf/chae-kim-resume.pdf`. Every resume link already points there.
- Email is assembled at runtime from `data-user` / `data-domain` attributes (see `main.js`) so it isn't in the HTML.
- Analytics: `/_vercel/insights/script.js` is included; enable Web Analytics in the Vercel dashboard for it to record.

## Photo credits

Project thumbnails are from Unsplash (free license): suitcases, sick-day kit, golden retriever, library study group, students with laptop, red house, meditation dock. Case-study imagery is Chae's own work.
