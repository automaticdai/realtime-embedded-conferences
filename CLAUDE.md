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
  "remarks": "Additional info, key dates",
  "deadline": "YYYY-MM-DD",
  "deadline_precision": "day|month|year",
  "category": "Real-Time Systems|Embedded Systems|Design Automation|Robotics|Robotics & AI|AI"
}
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
