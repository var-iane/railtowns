// scripts/csv-to-clean-json.js
import fs from 'fs';
import { csvParse } from 'd3-dsv';

const INPUT = 'src/lib/data/town_populations.csv';
const OUTPUT = 'src/lib/data/town_populations.json';

const text = fs.readFileSync(INPUT, 'utf8');
const rows = csvParse(text);

// helper: parse numbers safely
const toNumber = (v) => {
  if (v == null) return NaN;
  const s = String(v).trim();
  if (s === '' || s === 'NA' || s === 'NaN' || s === '—') return NaN;
  // normalize unicode minus and remove commas/percent signs
  const norm = s.replace('−', '-').replace(/,/g, '').replace(/%$/, '');
  const n = Number(norm);
  return Number.isFinite(n) ? n : NaN;
};

// build cleaned objects
const cleaned = rows.map((d) => {
  const {
    Name,
    State,
    Year,
    Population,
    // rename this ↓
    'Percent change': PercentChangeRaw,
    ...rest // keep any other columns as-is
  } = d;

  return {
    ...rest,            // optional: keep other columns
    Name,
    State,
    Year: toNumber(Year),
    Population: toNumber(Population),
    PercentChange: toNumber(PercentChangeRaw)
  };
});

// optional: stable sort (by State, then Name, then Year)
cleaned.sort((a, b) =>
  (a.State ?? '').localeCompare(b.State ?? '') ||
  (a.Name ?? '').localeCompare(b.Name ?? '') ||
  (a.Year ?? 0) - (b.Year ?? 0)
);

fs.writeFileSync(OUTPUT, JSON.stringify(cleaned, null, 2));
console.log(`wrote ${cleaned.length} rows to ${OUTPUT}`);