# Agent Instructions for Bush Turkey Track Club Website

## Overview

The site is an [Astro](https://astro.build) static site styled with Tailwind CSS, deployed to GitHub Pages
(`www.bushturkey.club`) by `.github/workflows/deploy.yml` on every push to `main`.

Almost every update is a **content or data change**, not a code change:

| Task | Where | What you do |
|---|---|---|
| New or upcoming event | `src/content/events/<slug>/index.md` | Create a folder with `index.md` and a hero image |
| Event results | same event folder | Add Chiron IDs, CSV files or a link to the `results` field |
| Event photos | same event folder | Add images and list them under `gallery` |
| Club records | `src/data/performances.yaml` | Append a row |
| Bush Turkey Classic champions | `src/data/champions.yaml` | Append a row |
| Team members | `src/data/members.yaml` | Add or remove a row |

Things that are **automatic**, so never edit them by hand:

- The home page "Upcoming events" block, the events list, event cards and each event's "More …" editions
  section are all built from `src/content/events/`. There is no list of previous events to maintain.
- Whether an event shows as **Upcoming**, **In progress** or **Results** is worked out from its dates
  (Brisbane time) when the site is built.
- Records are sorted and trimmed to each athlete's best time, top 3 per distance and sex.
- Members are sorted by last name.
- `sitemap-index.xml`, social preview tags and responsive images.

### Commands

```sh
npm install        # once
npm run dev        # local dev server at http://localhost:4321
npm run check      # type-check content and code (schema errors show here)
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
```

**Always run `npm run check && npm run build` before committing.** Content is validated against the schema
in `src/content.config.ts`, so a bad date, unknown series, missing image or missing CSV fails the build
with a message saying what is wrong.

---

## Task 1: Updating Club Records

### When to apply
The user asks to add a result to the club records (e.g. "Add John's new 5K PB to the records").

### Required information
- **Athlete name**: first and last name. If only a first name is given, check `performances.yaml` for an
  existing athlete with that first name and use their full name. If there's no match, ask for the full name.
- **Time**
- **Distance**: `marathon`, `half-marathon`, `10km`, `5km` or `3000m`
- **Sex**: `men` or `women`
- **Year**: if not given, assume the current year (2026)

### Process
1. Check the time qualifies: compare it against the current top 3 for that distance and sex in
   `src/data/performances.yaml` (each athlete counts once, with their best time). If it is slower than
   the current 3rd place, tell the user it doesn't make the list and wait for instructions.
2. Append a row to the end of `src/data/performances.yaml`:
   ```yaml
   - { name: John Smith, distance: 10km, sex: men, time: "32:35", year: 2026 }
   ```
3. Don't delete or reorder existing rows. The records page does the sorting, removes duplicates per
   athlete and shows the top 3.

### Time formats (quote the time)

| Distance | Format | Example |
|---|---|---|
| Marathon, Half Marathon | `h:mm:ss` | `"2:27:14"` |
| 10km, 5km | `mm:ss` | `"32:40"` |
| 3000m | `mm:ss.cc` | `"9:00.36"` |

### Bush Turkey Classic champions
When a Classic series finishes, append to `src/data/champions.yaml`:
```yaml
- { year: 2026, men: Name Surname, women: Name Surname }
```

---

## Task 2: Adding an Upcoming Event

### When to apply
The user asks to set up the website for a new event (e.g. "Update the website for the Bush Turkey Classic 2026").

### Process
1. **Pick the slug**: `<series>-<year>`, e.g. `bush-turkey-classic-2026`, `bush-turkey-relay-2026`,
   `nudgee-gift-2026`. For a series that spans New Year, use the starting year.
2. **Copy the most recent edition** of the same series as a starting point:
   `src/content/events/bush-turkey-classic-2025/` → `src/content/events/bush-turkey-classic-2026/`.
   Keep `index.md`, replace the images and delete old result CSVs.
3. **Update the frontmatter**: title, dates, times, locations, links, `summary`, `hero`/`heroAlt`, rounds.
   Remove `results` until results exist (or add the Chiron IDs if already known, see Task 3).
4. **Update the body text** below the frontmatter (description, warnings, scoring rules).
5. **Hero image**: put it in the event folder (`hero.jpg`) with descriptive `heroAlt` text. Any size or format
   works; Astro resizes and converts it. Prefer landscape photos; posters with text are fine too. If there's
   no image yet, leave `hero` out and the club logo is shown instead.

That's all. The home page, events list and the previous edition's page update themselves when the site is
built. **Do not** edit `index.astro`, `events/index.astro` or other event pages to add links.

If the series doesn't exist yet, add it to `SERIES` in `src/consts.ts` first.

### Event frontmatter reference

```yaml
---
title: Bush Turkey Classic 2026–27          # shown on cards and the event page
series: bush-turkey-classic                 # key from SERIES in src/consts.ts
date: 2026-12-12                            # race day, or first round
endDate: 2027-01-30                         # optional: last round of a series
monthOnly: false                            # optional: true shows "April 2024" when the day isn't known
time: 5:00 PM                               # optional: single-day start time
location:                                   # optional
  name: Deagon Speedway
  mapUrl: "https://maps.app.goo.gl/..."
summary: One or two sentences for cards and social previews.
hero: ./hero.jpg                            # optional: without it the card shows the club logo
heroAlt: What the hero image shows          # required when hero is set
heroFit: cover                              # optional: "contain" for logos/posters that crop badly on cards
registerUrl: "https://www.revolutionise.com.au/bushturkeytc/shop"  # optional, hidden after the event
photosUrl: "https://photos.app.goo.gl/..."  # optional: external album
links:                                      # optional: extra buttons in the header
  - { label: Event updates, url: "https://www.facebook.com/..." }
rounds:                                     # optional: multi-round series
  - name: "Round One: Fox Coffee Mile"
    date: 2026-12-12
    time: 6:00 AM
    description: One or two sentences about the course.
    meet:                                   # optional warm-up meeting point
      time: 5:20 AM
      place: Corner of Racecourse Road and Board Street, Deagon
      mapUrl: "https://maps.app.goo.gl/..."
    image: ./round-1-poster.png             # optional
    imageAlt: Round One poster
    links:
      - { label: Course, url: "https://www.strava.com/routes/..." }
      - { label: Event updates, url: "https://www.facebook.com/share/..." }
results: ...                                # see Task 3
gallery: []                                 # see Task 3
draft: false                                # true hides the event from the site
---

Body text in Markdown. Use `> **Warning:** ...` for the risk warning and `## Scoring` for scoring rules.
```

Dates are `YYYY-MM-DD`. Always quote URLs.

---

## Task 3: Results and Photos for an Event

Every event has at most one `results` entry. Choose the `source` that matches how the event was timed.

### A. Chiron race timing (Bush Turkey Classic and Relay from 2025)
Take the ID from the Chiron URL the user gives you:

- Series: `https://events.chironapp.com/series/<id>`
  ```yaml
  results:
    source: chiron
    type: series
    id: f60bf104-4903-4e8e-b4e1-dd9ef73193e5
  ```
- Single event: `https://events.chironapp.com/events/<id>/teams`
  ```yaml
  results:
    source: chiron
    type: event
    id: 7529ee32-fa91-410b-8c78-bc3d7299c789
    view: teams          # optional sub-page after the id
  ```

The page embeds the live Chiron results with an "Open full results" link, so these can be added before
race day. Optionally, once results are final, save a CSV export in the event folder and add
`archive: results/final.csv` to keep a copy on the site.

### B. Our own results data (older events, hand timing, anything not on Chiron)
1. Save one CSV per table in the event folder, e.g. `results/round-1.csv`, `results/series-women.csv`.
   The first row is the column headings. Any columns work.
2. List them in the frontmatter:
   ```yaml
   results:
     source: data
     tables:
       - { title: Women's series overall, file: results/series-women.csv, filters: [Age Group] }
       - { title: Round One, file: results/round-1.csv, filters: [Category], note: Optional note }
   ```
   `filters` names columns to offer as dropdown filters. The table always has click-to-sort columns and a
   name search. A column named `Position`/`Place` shows medals for places 1–3.
3. To convert tables from an HTML page: `python3 scripts/legacy-tables-to-csv.py <page>.html <out-dir>/`

### C. Results hosted elsewhere
```yaml
results:
  source: link
  url: "https://..."
  label: Official results   # optional button text
```

### Photos
Past events are badged **Results** when they have `results`, **Photos** when they have `photosUrl` or a
`gallery`, and **Past event** otherwise.

Put photos in the event folder (e.g. `photos/`) and list them with alt text. Link the full album with
`photosUrl`.
```yaml
gallery:
  - { image: ./photos/start.jpg, alt: Runners at the start of Round One }
```
Use descriptive alt text. Large originals are fine; the build resizes them.

---

## Task 4: Managing Team Members

Members live in `src/data/members.yaml` and are shown on `/about/`, sorted by last name automatically.

- **Add**: append `- { first: Neville, last: Norton }` anywhere in the list.
- **Remove**: delete that member's row.
- Multi-word surnames go in `last` (`{ first: Cecylia, last: Kubicki Garcia }`), and names containing an
  apostrophe must be quoted (`last: "O'Brien"`).
- Keep the exact spelling and capitalisation the user gives (e.g. `GREWAL`).
- Check there's no duplicate before adding.

---

## Project Structure

```
src/
  consts.ts              site name, links, nav, event SERIES
  content.config.ts      schemas for events, performances, champions, members
  content/events/<slug>/ one folder per event: index.md, images, results/*.csv
  data/                  performances.yaml, champions.yaml, members.yaml
  components/            EventCard, ResultsTable, ChironResults, Button, Icon, …
  layouts/BaseLayout.astro  <head>, analytics, header and footer for every page
  lib/                   event status and date helpers, CSV and time parsing
  pages/                 routes: index, events/, events/[slug], records, about, running-calculator
  redirects.mjs          old *.html URLs → new pages
public/                  copied as-is: CNAME, favicons, calculator scripts, videos (public/events/<slug>/)
scripts/                 helpers, e.g. converting HTML results tables to CSV
```

## Club Racing and Other One-off Events

Club trips to outside races (marathons, championships) use `series: club-racing`, usually with
`monthOnly: true`, a hero photo and `photosUrl`. They don't need results.

## Videos

Astro doesn't process video, so put video files in `public/events/<slug>/` and embed them in the event
body with a `<video controls preload="metadata" playsinline class="w-full rounded-xl">` tag.

## General Guidelines

- **Year assumption**: if the user doesn't give a year, assume 2026.
- **Don't hand-edit generated lists**: events, editions, records order and members order are computed.
- **Images**: always give descriptive alt text.
- **Verify**: `npm run check && npm run build` must pass. For layout changes, run `npm run preview` and look
  at the page.
- **Styling**: use Tailwind classes and the brand tokens in `src/styles/global.css`
  (`navy-*`, `turkey`, `wattle`, `font-display`). Don't add new CSS frameworks or UI libraries.
