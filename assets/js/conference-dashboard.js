(() => {
  const STATUS_LABELS = {
    upcoming: 'Upcoming',
    deadline_passed: 'Deadline Passed',
    archived: 'Archived',
  };

  const SORT_OPTIONS = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'when', label: 'Event Dates' },
    { value: 'name', label: 'Name' },
  ];
  const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
  const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  function ready(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
  }

  function formatText(value) {
    return value && value.trim().length ? value.trim() : '—';
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderInlineMarkdown(text) {
    if (!text) return '';
    let output = escapeHtml(text);
    output = output.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label, href) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
    output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
    output = output.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return output;
  }

  function renderMarkdown(value) {
    if (!value || !value.trim()) {
      return '—';
    }

    const lines = value.split(/\r?\n/);
    const blocks = [];
    let listBuffer = [];
    let paragraphBuffer = [];

    const flushParagraph = () => {
      if (!paragraphBuffer.length) return;
      const content = renderInlineMarkdown(paragraphBuffer.join(' '));
      blocks.push(`<p>${content}</p>`);
      paragraphBuffer = [];
    };

    const flushList = () => {
      if (!listBuffer.length) return;
      const items = listBuffer
        .map((item) => `<li>${renderInlineMarkdown(item)}</li>`)
        .join('');
      blocks.push(`<ul>${items}</ul>`);
      listBuffer = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }

      const listMatch = line.match(/^-\s+(.*)/);
      if (listMatch) {
        flushParagraph();
        listBuffer.push(listMatch[1]);
      } else {
        flushList();
        paragraphBuffer.push(line);
      }
    }

    flushParagraph();
    flushList();

    return blocks.length ? blocks.join('') : renderInlineMarkdown(value);
  }

  function renderInlineOrDash(value) {
    if (!value || !value.trim()) {
      return '—';
    }
    return renderInlineMarkdown(value);
  }

  function formatDeadline(entry) {
    if (!entry.deadline) {
      return '—';
    }

    const timestamp = Date.parse(entry.deadline);
    if (Number.isNaN(timestamp)) {
      return formatText(entry.deadline);
    }

    const date = new Date(timestamp);
    if (entry.deadline_precision === 'year') {
      return `${date.getUTCFullYear()} (approx.)`;
    }

    if (entry.deadline_precision === 'month') {
      return `${MONTH_FORMAT.format(date)} (approx.)`;
    }

    return DATE_FORMAT.format(date);
  }

  /* Mirrors Jekyll's `slugify` filter, so the row ids the JS produces match
     the ones rendered into the HTML at build time and #conf-... links keep
     working after the table is re-rendered. */
  function conferenceSlug(name) {
    if (!name) return '';
    const markdownLink = /^\s*\[([^\]]+)\]\(([^)]+)\)\s*$/;
    const match = name.match(markdownLink);
    const label = match ? match[1] : name;
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function renderNameCell(name) {
    if (!name) return '—';
    const markdownLink = /^\s*\[([^\]]+)\]\(([^)]+)\)\s*$/;
    const match = name.match(markdownLink);
    if (!match) {
      return name;
    }
    const [, label, href] = match;
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = label;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor.outerHTML;
  }

  function normalizeDate(value) {
    if (!value) {
      return Number.POSITIVE_INFINITY;
    }
    const ts = Date.parse(value);
    return Number.isNaN(ts) ? Number.POSITIVE_INFINITY : ts;
  }

  function buildOption(value, label, selectedValue) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === selectedValue) {
      option.selected = true;
    }
    return option;
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function normalizeWhen(value) {
    if (!value) {
      return Number.POSITIVE_INFINITY;
    }

    const cleaned = value
      .replace(/–/g, '-')
      .replace(/\(.*?\)/g, '')
      .trim();

    const rangePattern =
      /([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*[-–]\s*(?:[A-Za-z]+\s*)?\d{1,2})?,?\s*(\d{4})/;
    const match = cleaned.match(rangePattern);

    let candidate = cleaned;
    if (match) {
      const [, month, day, year] = match;
      candidate = `${month} ${day}, ${year}`;
    }

    const timestamp = Date.parse(candidate);
    return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
  }

  function initDashboard(container, data) {
    const tableBody = container.querySelector('tbody');
    const statusSelect = container.querySelector('[data-filter="status"]');
    const typeSelect = container.querySelector('[data-filter="type"]');
    const categorySelect = container.querySelector('[data-filter="category"]');
    const sortSelect = container.querySelector('[data-filter="sort"]');
    const orderButton = container.querySelector('[data-filter="sort-order"]');
    const searchInput = container.querySelector('[data-filter="search"]');
    const summary = container.querySelector('[data-role="summary"]');
    const resetButton = container.querySelector('[data-action="reset"]');

    const state = {
      raw: data,
      filters: {
        status: 'upcoming',
        type: '',
        category: '',
        search: '',
      },
      sort: {
        key: 'deadline',
        direction: 'asc',
      },
    };

    // Populate status options
    if (statusSelect && statusSelect.children.length === 0) {
      statusSelect.appendChild(buildOption('', 'All statuses', state.filters.status));
      Object.entries(STATUS_LABELS).forEach(([value, label]) => {
        statusSelect.appendChild(buildOption(value, label, state.filters.status));
      });
    }

    if (categorySelect && categorySelect.children.length === 0) {
      const categories = uniqueSorted(data.map((entry) => entry.category || ''));
      categorySelect.appendChild(buildOption('', 'All categories', state.filters.category));
      categories.forEach((category) => {
        if (!category) return;
        categorySelect.appendChild(buildOption(category, category, state.filters.category));
      });
    }

    // Populate type options from data
    if (typeSelect && typeSelect.children.length === 0) {
      const types = uniqueSorted(data.map((entry) => entry.type || 'conference'));
      typeSelect.appendChild(buildOption('', 'All types', state.filters.type));
      types.forEach((type) => {
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        typeSelect.appendChild(buildOption(type, label, state.filters.type));
      });
    }

    // Populate sort options
    if (sortSelect && sortSelect.children.length === 0) {
      SORT_OPTIONS.forEach(({ value, label }) => {
        sortSelect.appendChild(buildOption(value, label, state.sort.key));
      });
    }

    function applyFilters() {
      let filtered = [...state.raw];

      if (state.filters.status) {
        filtered = filtered.filter(
          (entry) => entry.status === state.filters.status
        );
      }

      if (state.filters.type) {
        filtered = filtered.filter(
          (entry) => (entry.type || 'conference') === state.filters.type
        );
      }

      if (state.filters.category) {
        filtered = filtered.filter(
          (entry) => (entry.category || '').toLowerCase() === state.filters.category.toLowerCase()
        );
      }

      if (state.filters.search) {
        const needle = state.filters.search.toLowerCase();
        filtered = filtered.filter((entry) => {
          const haystack = [
            entry.name,
            entry.where,
            entry.when,
            entry.remarks,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return haystack.includes(needle);
        });
      }

      const sorted = filtered.sort((a, b) => {
        if (state.sort.key === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (state.sort.key === 'when') {
          const delta = normalizeWhen(a.when) - normalizeWhen(b.when);
          if (delta !== 0) {
            return delta;
          }
          return (a.deadline || '').localeCompare(b.deadline || '') || a.name.localeCompare(b.name);
        }
        const delta = normalizeDate(a.deadline) - normalizeDate(b.deadline);
        if (delta !== 0) {
          return delta;
        }
        return normalizeWhen(a.when) - normalizeWhen(b.when) || a.name.localeCompare(b.name);
      });

      if (state.sort.direction === 'desc') {
        sorted.reverse();
      }

      return sorted;
    }

    function render() {
      const entries = applyFilters();
      tableBody.innerHTML = '';

      if (!entries.length) {
        const emptyRow = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8;
        cell.textContent = 'No conferences match the current filters.';
        emptyRow.appendChild(cell);
        tableBody.appendChild(emptyRow);
      } else {
        for (const entry of entries) {
          const row = document.createElement('tr');
          row.id = `conf-${conferenceSlug(entry.name)}`;
          row.innerHTML = `
            <td class="cell-name">${renderNameCell(entry.name)}</td>
            <td class="cell-deadline">${formatDeadline(entry)}</td>
            <td><span class="badge badge--${entry.status}">${STATUS_LABELS[entry.status] || entry.status}</span></td>
            <td>${(entry.type || 'conference').replace(/^\w/, (c) => c.toUpperCase())}</td>
            <td>${formatText(entry.category)}</td>
            <td class="cell-where">${renderInlineOrDash(entry.where)}</td>
            <td class="cell-when">${formatText(entry.when)}</td>
            <td class="cell-remarks">${renderMarkdown(entry.remarks)}</td>
          `;
          tableBody.appendChild(row);
        }
      }

      if (summary) {
        summary.textContent = `Showing ${entries.length} of ${state.raw.length} conferences`;
      }

      if (orderButton) {
        orderButton.textContent =
          state.sort.direction === 'asc' ? 'Ascending ↑' : 'Descending ↓';
      }
    }

    function resetFilters() {
      state.filters = { status: 'upcoming', type: '', category: '', search: '' };
      state.sort = { key: 'deadline', direction: 'asc' };
      if (statusSelect) statusSelect.value = state.filters.status;
      if (typeSelect) typeSelect.value = state.filters.type;
      if (categorySelect) categorySelect.value = state.filters.category;
      if (sortSelect) sortSelect.value = state.sort.key;
      if (orderButton) state.sort.direction = 'asc';
      if (searchInput) searchInput.value = '';
      render();
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (event) => {
        state.filters.status = event.target.value;
        render();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (event) => {
        state.filters.category = event.target.value;
        render();
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', (event) => {
        state.filters.type = event.target.value;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        state.sort.key = event.target.value;
        render();
      });
    }

    if (orderButton) {
      orderButton.addEventListener('click', () => {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        state.filters.search = event.target.value.trim();
        render();
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => resetFilters());
    }

    render();
  }

  /* ------------------------------------------------------------------ horizon

     Draws the open calls as lanes on a shared time axis: one row per venue,
     a marker where its deadline falls, a dotted lead-in for the time still
     left. Hollow markers are deadlines predicted from the previous edition
     rather than taken from a published call.
     ----------------------------------------------------------------------- */

  const MIN_HORIZON_MONTHS = 6;
  const URGENT_DAYS = 30;
  const DAY_MS = 86400000;
  const TICK_FORMAT = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    timeZone: 'UTC',
  });
  const HORIZON_END_FORMAT = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  function startOfUtcToday() {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }

  function daysUntil(timestamp, from) {
    return Math.round((timestamp - from) / DAY_MS);
  }

  function countdownLabel(days) {
    if (days <= 0) return 'today';
    if (days === 1) return 'tomorrow';
    if (days < 45) return `${days} days`;
    if (days < 90) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30.44)} months`;
  }

  /* The axis runs to the furthest open deadline rather than a fixed span, so
     every upcoming call fits on it however far out the list reaches. */
  function horizonEnd(from, latest) {
    const floor = new Date(from);
    floor.setUTCMonth(floor.getUTCMonth() + MIN_HORIZON_MONTHS);

    const end = new Date(Math.max(floor.getTime(), latest));
    end.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + 1);
    return end.getTime();
  }

  function tickStep(months) {
    if (months <= 8) return 1;
    if (months <= 18) return 2;
    return 3;
  }

  function buildTicks(from, to) {
    const ticks = [];
    const span = to - from;
    const months = Math.round(span / (DAY_MS * 30.44));
    const step = tickStep(months);

    const cursor = new Date(from);
    cursor.setUTCDate(1);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);

    while (cursor.getTime() < to) {
      const ts = cursor.getTime();
      const isJanuary = cursor.getUTCMonth() === 0;
      ticks.push({
        left: ((ts - from) / span) * 100,
        label: isJanuary
          ? `${TICK_FORMAT.format(cursor)} '${String(cursor.getUTCFullYear()).slice(2)}`
          : TICK_FORMAT.format(cursor),
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + step);
    }

    return ticks;
  }

  /* Keep the hover card inside the plot: nudge its anchor point when the
     marker sits near either end of the axis. */
  function detailAlignment(left) {
    if (left < 15) return 'start';
    if (left > 85) return 'end';
    return 'mid';
  }

  function renderDetail(entry, predicted) {
    const rows = [
      ['Deadline', escapeHtml(formatDeadline(entry))],
      ['Event', escapeHtml(formatText(entry.when))],
      ['Venue', renderInlineOrDash(entry.where)],
    ];

    const list = rows
      .map(([term, value]) => `<dt>${term}</dt><dd>${value}</dd>`)
      .join('');

    const caveat = predicted
      ? '<p class="horizon__caveat">Predicted from the previous edition. ' +
        'The call for papers has not been published yet.</p>'
      : '';

    return `<dl class="horizon__detail-rows">${list}</dl>${caveat}`;
  }

  function initHorizon(container, data) {
    const plot = container.querySelector('[data-role="horizon-plot"]');
    const counts = container.querySelector('[data-role="horizon-counts"]');
    const note = container.querySelector('[data-role="horizon-note"]');
    if (!plot && !counts) return;

    const today = startOfUtcToday();

    const open = data
      .filter((entry) => entry.status === 'upcoming')
      .map((entry) => ({ entry, at: normalizeDate(entry.deadline) }))
      .filter((item) => Number.isFinite(item.at) && item.at >= today)
      .sort((a, b) => a.at - b.at);

    const closingSoon = open.filter(
      (item) => daysUntil(item.at, today) <= URGENT_DAYS
    ).length;

    if (counts) {
      counts.innerHTML = [
        `<li class="horizon__count"><strong>${open.length}</strong>open calls</li>`,
        `<li class="horizon__count${closingSoon ? ' horizon__count--urgent' : ''}">` +
          `<strong>${closingSoon}</strong>closing within ${URGENT_DAYS} days</li>`,
        `<li class="horizon__count"><strong>${data.length}</strong>venues tracked</li>`,
      ].join('');
    }

    if (!plot) return;

    if (!open.length) {
      plot.innerHTML = '<p class="horizon__empty">No open calls right now.</p>';
      if (note) note.textContent = 'Every deadline on the list has passed.';
      return;
    }

    const windowEnd = horizonEnd(today, open[open.length - 1].at);
    const span = windowEnd - today;

    if (note) {
      note.textContent = `Every open call, through ${HORIZON_END_FORMAT.format(
        new Date(windowEnd)
      )}.`;
    }

    const ticks = buildTicks(today, windowEnd)
      .map(
        (tick) =>
          `<span class="horizon__tick" style="left:${tick.left.toFixed(2)}%">${tick.label}</span>`
      )
      .join('');

    const rows = open
      .map(({ entry, at }) => {
        const days = daysUntil(at, today);
        const left = Math.min(100, Math.max(0, ((at - today) / span) * 100));
        const predicted = entry.deadline_precision !== 'day';
        const urgent = days <= URGENT_DAYS;
        const offset = `${left.toFixed(2)}%`;

        return [
          `<div class="horizon__lane${urgent ? ' horizon__lane--urgent' : ''}">`,
          '<div class="horizon__name">',
          renderNameCell(entry.name),
          `<span class="horizon__stamp">${escapeHtml(formatDeadline(entry))}</span>`,
          '</div>',
          '<div class="horizon__track">',
          `<span class="horizon__wait" style="width:${offset}" aria-hidden="true"></span>`,
          `<span class="horizon__marker${predicted ? ' horizon__marker--predicted' : ''}"`,
          ` style="left:${offset}" aria-hidden="true"></span>`,
          `<div class="horizon__detail horizon__detail--${detailAlignment(left)}"`,
          ` style="left:${offset}" role="presentation">`,
          renderDetail(entry, predicted),
          '</div>',
          '</div>',
          `<div class="horizon__when">${countdownLabel(days)}</div>`,
          '</div>',
        ].join('');
      })
      .join('');

    plot.innerHTML =
      '<div class="horizon__axis" aria-hidden="true"><span></span>' +
      `<span class="horizon__scale">${ticks}</span><span></span></div>` +
      rows +
      '<p class="horizon__key">' +
      '<span><i class="horizon__swatch"></i>Deadline from a published call</span>' +
      '<span><i class="horizon__swatch horizon__swatch--predicted"></i>Predicted from last year\'s edition</span>' +
      '<span class="horizon__hint">Hover a row for dates and venue</span>' +
      '</p>';
  }

  async function fetchData(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load conference data (${response.status})`);
    }
    return response.json();
  }

  ready(async () => {
    const container = document.querySelector('.conference-dashboard[data-json]');
    if (!container) {
      return;
    }
    const source = container.getAttribute('data-json') || 'assets/data/conferences.json';
    try {
      const data = await fetchData(source);
      initDashboard(container, data);
      const horizon = document.querySelector('[data-role="horizon"]');
      if (horizon) {
        initHorizon(horizon, data);
      }
    } catch (error) {
      console.error(error);
      const fallback = container.querySelector('[data-role="summary"]');
      if (fallback) {
        fallback.textContent = 'Failed to load conference data.';
        fallback.classList.add('error');
      }
    }
  });
})();

