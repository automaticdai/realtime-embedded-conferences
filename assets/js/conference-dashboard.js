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
          row.innerHTML = `
            <td class="cell-name">${renderNameCell(entry.name)}</td>
            <td>${formatDeadline(entry)}</td>
            <td><span class="badge badge--${entry.status}">${STATUS_LABELS[entry.status] || entry.status}</span></td>
            <td>${(entry.type || 'conference').replace(/^\w/, (c) => c.toUpperCase())}</td>
            <td>${formatText(entry.category)}</td>
            <td>${renderInlineOrDash(entry.where)}</td>
            <td>${formatText(entry.when)}</td>
            <td>${renderMarkdown(entry.remarks)}</td>
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

