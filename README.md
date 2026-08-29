# Real-Time, Embedded, CPS & Robotics Conferences Tracker

![](https://badgen.net/github/stars/automaticdai/realtime-embedded-conferences) ![](https://badgen.net/github/contributors/automaticdai/realtime-embedded-conferences)

> A community-maintained tracker of submission deadlines for the leading conferences in real-time systems, embedded systems, design automation, cyber-physical systems and robotics.

**➜ [View the tracker](https://automaticdai.github.io/realtime-embedded-conferences/)**

Currently tracking **166 venues**. The list is updated weekly. If you find it useful, please ⭐ the repository.

**Maintainer**: **[Dr. Steven Xiaotian Dai](http://www.xiaotiandai.com)**, Real-Time and Distributed Systems Group, University of York, UK

## Using the tracker

The site has two views over the same data:

- **Timeline View (Deadlines)** — every open call as a lane on a shared time axis, ordered by deadline. A solid marker is a deadline taken from a published call for papers; a hollow marker is one predicted from the previous edition. Hovering a row shows the exact deadline, the event dates and the venue.
- **Detailed List** — the full table, filterable by status, type and category, sortable, and searchable across venue, city and remarks.

Every conference row has a stable anchor, so you can link straight to one — for example
[`#conf-icra-2027`](https://automaticdai.github.io/realtime-embedded-conferences/#conf-icra-2027).

### Reading the dates

- Most deadlines are **AoE** (Anywhere on Earth, UTC-12:00), but some conferences use a local time zone. Verify the time zone as a deadline approaches.
- Listed deadlines are for **main-conference submissions**. Workshops, brief presentations and industrial tracks usually have their own.
- A deadline shown as *(approx.)* is **predicted from the previous edition** — the call for papers has not been published yet.

## Contributing

Corrections and additions are very welcome:

1. [Open an issue](https://github.com/automaticdai/realtime-embedded-conferences/issues)
2. Send a pull request editing `_data/conferences.json`
3. Fill in the [feedback form](https://forms.gle/XhDSDSr6L7GTpoEC6)
4. Email _xiaotian.dai (at) york.ac.uk_

### Conference entry schema

`_data/conferences.json` is the **single source of truth** — it is the only file to edit.

```json
{
  "name": "[Conference Name](https://url)",
  "type": "conference | workshop",
  "status": "upcoming | deadline_passed | archived",
  "where": "City, Country",
  "when": "Month Day-Day, Year",
  "remarks": "Description.\n- Important date 1\n- Important date 2",
  "deadline": "YYYY-MM-DD",
  "deadline_precision": "day | month | year",
  "category": "Real-Time Systems | Embedded Systems | Design Automation | Robotics | Robotics & AI | AI"
}
```

`status` moves `upcoming` → `deadline_passed` when the submission deadline passes, then → `archived`
once the event itself has concluded. Use `deadline_precision: "month"` for a deadline predicted from
last year's edition; the site renders those as *(approx.)* and marks them hollow on the timeline.

Important dates in `remarks` should be markdown bullets separated by `\n`, with any description as a
leading paragraph.

## How it is built

Jekyll on GitHub Pages, with no theme gem — the site owns its own layout and stylesheet.

```
_data/conferences.json             single source of truth
assets/data/conferences.json       Jekyll template; emits the data as JSON at build time
_layouts/default.html              page shell
index.md                           the page; renders the table from _data at build time
assets/css/style.scss              standalone stylesheet
assets/js/conference-dashboard.js  timeline, filtering, sorting, search
scripts/filterConferences.mjs      CLI for querying the data
```

The conference table is **rendered at build time** from `_data/conferences.json`, so the full list is
in the HTML for search engines and for readers without JavaScript. The dashboard script then takes
over to provide the timeline, filtering and sorting. Rows that are not `upcoming` start hidden so the
first paint matches the default filter.

`assets/data/conferences.json` is a Jekyll template containing `{{ site.data.conferences | jsonify }}`
— it regenerates itself on every build and should never be edited by hand.

### Local preview

```bash
bundle install
bundle exec jekyll serve
```

The site is served under its `baseurl`, at <http://127.0.0.1:4000/realtime-embedded-conferences/>.

### Querying from the command line

```bash
# Upcoming deadlines, soonest first
node scripts/filterConferences.mjs --status upcoming --sort deadline --columns name,deadline,where,when

# Workshops whose deadline has already gone
node scripts/filterConferences.mjs --type workshop --finished true

# JSON for other tooling
node scripts/filterConferences.mjs --status archived --sort name --output json
```

Supported flags: `--type`, `--status`, `--category`, `--finished`, `--sort`, `--reverse`, `--limit`,
`--output`, `--columns`, `--help`.
