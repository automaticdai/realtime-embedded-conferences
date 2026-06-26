# CLAUDE.md

## Project Overview

This is a **Real-Time & Embedded Systems Conferences Tracker** - a community-maintained resource for tracking academic conference deadlines. Built with Jekyll and hosted on GitHub Pages.

**Maintainer**: Dr. Steven Xiaotian Dai, University of York, UK

## Tech Stack

- **Jekyll** + **GitHub Pages** for static site generation
- **Vanilla JavaScript** for the interactive dashboard
- **SCSS** for styling

## Key Files & Directories

```
_data/conferences.json          # Master data source (single source of truth)
assets/data/conferences.json    # Jekyll template that auto-generates from _data/
assets/js/conference-dashboard.js  # Interactive dashboard logic
assets/css/style.scss           # Dark theme styling
scripts/filterConferences.mjs   # CLI tool for filtering/exporting
index.md                        # Homepage with dashboard
```

## Data Architecture

Only edit `_data/conferences.json`. The file at `assets/data/conferences.json` is a Jekyll template that automatically outputs the data during build.

### Conference Entry Schema

```json
{
  "name": "[Conference Name](https://url)",
  "type": "conference|workshop",
  "status": "upcoming|deadline_passed|archived",
  "where": "City, Country",
  "when": "Month Day-Day, Year",
  "remarks": "Description text.\n- Important date 1\n- Important date 2",
  "deadline": "YYYY-MM-DD",
  "deadline_precision": "day|month|year",
  "category": "Real-Time Systems|Embedded Systems|Design Automation|Robotics|Robotics & AI|AI"
}
```

### Remarks Formatting

Important dates in `remarks` must use **markdown bullet points** with `\n` (newline) separators so they render as a list in the dashboard. If there is a description, put it before the bullets as a paragraph:

```json
"remarks": "Description text.\n- Submission deadline: March 1, 2026\n- Notification: April 15, 2026\n- Camera-ready: May 1, 2026"
```

If there is no description, start directly with bullets:

```json
"remarks": "- Abstract deadline: March 1, 2026\n- Paper deadline: March 8, 2026"
```

### Status Values

- `upcoming`: Deadline has not passed yet
- `deadline_passed`: Deadline passed but event hasn't occurred
- `archived`: Event has concluded

## Common Tasks

### Adding a new conference

Add a new entry to `_data/conferences.json` with all required fields. Place it near similar conferences (by year/status).

### Updating deadline status

When a deadline passes, change `"status": "upcoming"` to `"status": "deadline_passed"`.

### After an event concludes

Change status to `"archived"`.

## Update SOP

Standard procedure for a routine maintenance pass (e.g. weekly update). Run the two phases in order. Only edit `_data/conferences.json`. Use today's date as the reference point.

### Phase 1 — Check deadlines & roll over statuses

For every entry that is **not** already `archived`, compare it to today's date:

1. `upcoming` → `deadline_passed` when its `deadline` is before today (submission deadline has passed, event hasn't happened yet).
2. `deadline_passed` → `archived` when the event end date in `when` is before today (event has concluded). This applies to `upcoming` entries too, if an event somehow passed without the status being rolled over.
3. Leave everything else unchanged (future deadlines stay `upcoming`; future events stay `deadline_passed`).

After editing, validate the file and confirm nothing was missed:

```bash
node -e "const d=require('./_data/conferences.json'); console.log('Valid JSON,', d.length, 'entries'); const t='YYYY-MM-DD'; for(const c of d){ if(c.status==='upcoming' && c.deadline < t) console.log('MISSED:', c.name, c.deadline); }"
```

### Phase 2 — Add next-year entries

For **each conference** (not workshop, unless it clearly recurs standalone) that moved to `archived` in Phase 1, add a new entry for the next year's edition:

1. **Look up confirmed details** (web search for "`<conf> <next-year>` location dates call for papers"). Use the real `where`/`when` only when confirmed by an official or reliable source. If the host city or dates are unconfirmed or sources conflict, use `"(TBD)"` rather than guess.
2. **Predict the deadline**: take the previous edition's `deadline` and add one year. Set `"deadline_precision": "month"` and note the prediction in `remarks` (e.g. `"- Deadline predicted from <conf> <prev-year>; call for papers not yet announced."`). When the real CFP is later published, refine the deadline and bump precision to `"day"`.
3. Set `"status": "upcoming"`, keep the same `category` as the previous edition, and follow the same `name` URL pattern (e.g. year-based subdomains, series homepages).
4. **Place** the entry near other entries of the same year, in rough `deadline` order.

Validate and confirm the new entries:

```bash
node -e "const d=require('./_data/conferences.json'); console.log('Valid JSON,', d.length, 'entries');"
```

Flag any `where`/`when` sourced only from conference aggregator sites (not official) as needing a second confirmation before publishing.

## Build & Preview

```bash
bundle install
bundle exec jekyll serve
```

## CLI Tool

```bash
node scripts/filterConferences.mjs --status upcoming --sort deadline
node scripts/filterConferences.mjs --type workshop --output json
```
