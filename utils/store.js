/**
 * Tiny, dependency-free JSON file "database".
 *
 * This is the FOUNDATION for the backend — good enough to reliably
 * capture every submission from day one of going live, with zero
 * database setup required. When the project is ready for a real
 * database (Postgres, MongoDB, Airtable, etc.), replace the two
 * functions below and every route keeps working unchanged.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePathFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAll(name) {
  ensureDataDir();
  const file = filePathFor(name);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Could not read ${file}:`, err.message);
    return [];
  }
}

function appendEntry(name, entry) {
  ensureDataDir();
  const file = filePathFor(name);
  const entries = readAll(name);
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    receivedAt: new Date().toISOString(),
    ...entry,
  };
  entries.push(record);
  fs.writeFileSync(file, JSON.stringify(entries, null, 2), 'utf-8');
  return record;
}

module.exports = { readAll, appendEntry };
