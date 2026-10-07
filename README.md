> **⚠️ Experimental.** This repo is a test bed for portfolio redesigns. The live site is [chaekim-portfolio](https://github.com/chaekim96/chaekim-portfolio) at [chaekim.vercel.app](https://chaekim.vercel.app).

# Portfolio v2 (test / future iteration)

This is the experimental copy. The live site is `chaekim96/chaekim-portfolio`. This repo tracks the `portfolio-v2` branch there, plus a noindex so it never competes with production in search.

Sync: from the main repo, `git push v2 portfolio-v2:main --force-with-lease` (remote `v2`), then re-apply the noindex commit if needed.

---

# chaekim.dev — personal portfolio

Static site for Chae Kim: MBA candidate at UC Berkeley Haas, ex-EY AI & Data consultant, IU Informatics.

- `index.html` — home (hero, selected work, playground, experience, about, contact)
- `projects/*.html` — case studies (one file per project)
- `assets/css/style.css` — design tokens + components (light/dark)
- `assets/js/main.js` — theme toggle, mobile nav, filters, scroll reveal
- `assets/img`, `assets/pdf` — media and downloadable deliverables

No build step. Deployed on Vercel (`vercel.json` enables clean URLs so `/projects/luc` serves `projects/luc.html`).

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. Note: the Python server doesn't do clean URLs, so project links resolve to `/projects/luc.html` on Vercel but need the `.html` locally — use `npx serve .` for parity.

## Case studies

Featured / more-work pages are generated from one template: edit `scripts/build-cases.py` (content lives in the `CASES` list), run `python3 scripts/build-cases.py`, commit the HTML in `projects/`. `projects/_template.html` is the rendered empty shell for reference. The five college pages are hand-edited HTML.

Anything not yet confirmed is marked in the copy as `[CONFIRM: ...]` (styled yellow). Grep: `grep -rn "CONFIRM:" index.html projects/`.

## Updating content

- Add a project: duplicate a file in `projects/`, then add a `.card` in `index.html` with the right `data-cat` (`product`, `engineering`, `design`).
- Resume: replace `assets/pdf/chae-kim-resume.pdf`. Every resume link already points there.
- Email is assembled at runtime from `data-user` / `data-domain` attributes (see `main.js`) so it isn't in the HTML.
- Analytics: `/_vercel/insights/script.js` is included; enable Web Analytics in the Vercel dashboard for it to record.

## Photo credits

Project thumbnails are from Unsplash (free license): suitcases, sick-day kit, golden retriever, library study group, students with laptop, red house, meditation dock. Case-study imagery is Chae's own work.
