---
layout: default
title: Real-Time Embedded Systems, Design Automation & Cyber-Physical Systems
description: Community-maintained tracker of real-time, embedded, robotics, and cyber-physical conferences with deadlines, venues, and tooling.
---

# Real-Time Embedded Systems, Design Automation & Cyber-Physical Systems (Conferences Tracking)

![](https://badgen.net/github/stars/automaticdai/realtime-embedded-conferences) ![](https://badgen.net/github/contributors/automaticdai/realtime-embedded-conferences)


> A comprehensive, community-maintained tracker for the most influential conferences in real-time systems, embedded systems, design automation, cyber-physical systems, and robotics.

This tracker helps researchers stay informed about upcoming deadlines and important announcements in our research community. The list is updated weekly and organized by submission deadlines for upcoming conferences, followed by conference dates for events with passed deadlines. If you find this resource helpful, please ⭐ our [GitHub repository](https://github.com/automaticdai/realtime-embedded-conferences)!

**Date Format & Time Zones**:

- **Time Zone Notice:** Most deadlines are in AoE (Anywhere on Earth, UTC-12:00), but some conferences use local time zones. Always verify the specific time zone as deadlines approach.
- Listed deadlines are for main conference submissions; workshops, brief presentations, and industrial tracks typically have separate deadlines.

**Contributing**: This tracker thrives on community contributions! You can help by: (1) Submit an issue in the [issue list](https://github.com/automaticdai/realtime-embedded-conferences/issues); (2) Contact me through email: _xiaotian.dai (at) york.ac.uk_; (3) Fill out our [feedback form](https://forms.gle/XhDSDSr6L7GTpoEC6); or (4) Create a pull request (PR) with your changes.

**Maintainer**: **[Dr. Steven Xiaotian Dai](http://www.xiaotiandai.com)**, Real-Time and Distributed Systems Group, University of York, UK

## Data & View Layers

**Data layer**
- `_data/conferences.json` is the canonical file used by GitHub Pages/Liquid and the CLI
- `assets/data/conferences.json` is the browser-friendly copy served to the dashboard (auto-synced from the same script)
- `scripts/bootstrapDataFromReadme.mjs` regenerates both JSON files from the Markdown snapshots (run it whenever you touch the tables below)

**View + tooling**
- `scripts/filterConferences.mjs` lets you filter by `--type`, `--status`, or `--finished`, sort by `--sort deadline|name`, render Markdown tables, or emit JSON for other tooling
- The Markdown tables below are curated default views. Regenerate any view with the CLI and paste it back in (or keep data completely separate for programmatic consumers)

**Quick filters**
```bash
# Upcoming submission deadlines ordered by date
node scripts/filterConferences.mjs --status upcoming --sort deadline --columns name,deadline,where,when,remarks

# Workshops that already closed submissions
node scripts/filterConferences.mjs --type workshop --finished true --columns name,deadline,where,when

# JSON output for automation
node scripts/filterConferences.mjs --status archived --sort name --output json > tmp/archived.json
```