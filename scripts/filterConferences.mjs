#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataCandidates = [
  resolve(__dirname, '..', '_data', 'conferences.json'),
  resolve(__dirname, '..', 'assets', 'data', 'conferences.json'),
  resolve(__dirname, '..', 'data', 'conferences.json'),
];

const validSortKeys = new Set(['deadline', 'name']);
const validOutputs = new Set(['table', 'json']);
const availableColumns = {
  name: {
    label: 'Name',
    value: (record) => record.name,
  },
  deadline: {
    label: 'Deadline',
    value: (record) => record.deadline || '—',
  },
  status: {
    label: 'Status',
    value: (record) => record.status,
  },
  type: {
    label: 'Type',
    value: (record) => record.type,
  },
  category: {
    label: 'Category',
    value: (record) => record.category || '',
  },
  where: {
    label: 'Where',
    value: (record) => record.where,
  },
  when: {
    label: 'When',
    value: (record) => record.when,
  },
  remarks: {
    label: 'Remarks',
    value: (record) => record.remarks || '',
  },
  precision: {
    label: 'Deadline Precision',
    value: (record) => record.deadline_precision || '',
  },
};

function loadData() {
  for (const candidate of dataCandidates) {
    try {
      const raw = readFileSync(candidate, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      // Try the next candidate
    }
  }
  console.error(
    `Unable to read conference data. Did you run scripts/bootstrapDataFromReadme.mjs?`
  );
  console.error(`Checked paths:`);
  dataCandidates.forEach((candidate) => console.error(` - ${candidate}`));
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    sort: 'deadline',
    reverse: false,
    output: 'table',
    columns: ['name', 'deadline', 'status', 'type', 'category', 'where', 'when'],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const [flag, valueFromEquals] = arg.split('=');
    const getValue = () => {
      if (valueFromEquals !== undefined) return valueFromEquals;
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        throw new Error(`Missing value for ${flag}`);
      }
      i += 1;
      return next;
    };

    switch (flag) {
      case '--type':
        options.type = getValue()
          .split(',')
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean);
        break;
      case '--status':
        options.status = getValue()
          .split(',')
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean);
        break;
      case '--category':
        options.category = getValue()
          .split(',')
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean);
        break;
      case '--finished':
        options.finished = /^(1|true|yes)$/i.test(getValue());
        break;
      case '--sort':
        {
          const sortKey = getValue().toLowerCase();
          if (!validSortKeys.has(sortKey)) {
            throw new Error(
              `Unsupported sort key "${sortKey}". Use one of: ${[
                ...validSortKeys,
              ].join(', ')}`
            );
          }
          options.sort = sortKey;
        }
        break;
      case '--reverse':
        options.reverse = true;
        break;
      case '--limit':
        options.limit = Number.parseInt(getValue(), 10);
        if (Number.isNaN(options.limit) || options.limit <= 0) {
          throw new Error('--limit expects a positive integer');
        }
        break;
      case '--output':
        {
          const output = getValue().toLowerCase();
          if (!validOutputs.has(output)) {
            throw new Error(
              `Unsupported output "${output}". Use one of: table, json`
            );
          }
          options.output = output;
        }
        break;
      case '--columns':
        {
          const tokens = getValue()
            .split(',')
            .map((token) => token.trim().toLowerCase())
            .filter(Boolean);
          const unknown = tokens.filter((token) => !availableColumns[token]);
          if (unknown.length) {
            throw new Error(
              `Unknown column(s): ${unknown.join(', ')}. Available: ${Object.keys(
                availableColumns
              ).join(', ')}`
            );
          }
          options.columns = tokens;
        }
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown flag "${flag}"`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  node scripts/filterConferences.mjs [options]

Options:
  --type <t1,t2>        Filter by type (conference, workshop)
  --status <s1,s2>      Filter by status (upcoming, deadline_passed, archived)
  --category <c1,c2>    Filter by category (data source or custom tags)
  --finished <true|false>  Shortcut: true keeps non-upcoming, false keeps only upcoming
  --sort <deadline|name>   Sort column (default: deadline)
  --reverse             Reverse sort direction
  --limit <n>           Limit number of rows
  --output <table|json> Output format (default: table)
  --columns <list>      Columns to display for table output
  --help                Show this help message

Examples:
  node scripts/filterConferences.mjs --status upcoming --sort deadline
  node scripts/filterConferences.mjs --type workshop --finished true
  node scripts/filterConferences.mjs --output json --limit 5
`);
}

function normalizeDate(value) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;
  return timestamp;
}

function filterRecords(records, options) {
  let filtered = [...records];

  if (options.type && options.type.length) {
    filtered = filtered.filter((record) =>
    options.type.includes(record.type?.toLowerCase() ?? 'conference')
    );
  }

  if (options.status && options.status.length) {
    filtered = filtered.filter((record) =>
      options.status.includes(record.status?.toLowerCase())
    );
  }

  if (options.category && options.category.length) {
    filtered = filtered.filter((record) =>
      options.category.includes(record.category?.toLowerCase() ?? '')
    );
  }

  if (options.finished === true) {
    filtered = filtered.filter((record) => record.status !== 'upcoming');
  } else if (options.finished === false) {
    filtered = filtered.filter((record) => record.status === 'upcoming');
  }

  return filtered;
}

function sortRecords(records, options) {
  const sorted = [...records];
  if (options.sort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    sorted.sort((a, b) => {
      const aDate = normalizeDate(a.deadline) ?? Infinity;
      const bDate = normalizeDate(b.deadline) ?? Infinity;
      if (aDate === bDate) {
        return a.name.localeCompare(b.name);
      }
      return aDate - bDate;
    });
  }

  if (options.reverse) {
    sorted.reverse();
  }
  return sorted;
}

function formatTable(records, options) {
  if (!records.length) {
    return 'No matching conferences.';
  }
  const selectedColumns = options.columns ?? ['name', 'deadline', 'status'];
  const header = selectedColumns.map((column) => availableColumns[column].label);
  const rows = records.map((record) =>
    selectedColumns.map((column) => availableColumns[column].value(record))
  );

  const colWidths = header.map((_, colIdx) =>
    Math.max(
      header[colIdx].length,
      ...rows.map((row) => (row[colIdx] ?? '').length)
    )
  );

  const renderRow = (cols) =>
    `| ${cols
      .map((col, idx) => (col ?? '').padEnd(colWidths[idx], ' '))
      .join(' | ')} |`;

  const lines = [];
  lines.push(renderRow(header));
  lines.push(
    `| ${colWidths
      .map((width) => ''.padEnd(width, '-'))
      .join(' | ')} |`
  );
  rows.forEach((row) => lines.push(renderRow(row)));
  return lines.join('\n');
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    printHelp();
    process.exit(1);
  }

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const data = loadData();
  let records = filterRecords(data, options);
  records = sortRecords(records, options);

  if (options.limit) {
    records = records.slice(0, options.limit);
  }

  if (options.output === 'json') {
    console.log(JSON.stringify(records, null, 2));
  } else {
    console.log(formatTable(records, options));
  }
}

main();

