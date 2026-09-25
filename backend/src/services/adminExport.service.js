import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminExport.repository.js';

const VALID_DATA_TYPES = [
  'donors',
  'camps',
  'requests',
  'registrations',
  'volunteers',
  'feedback',
  'donations',
];

const VALID_FORMATS = ['csv', 'json'];

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(','));
  }
  return lines.join('\n');
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function exportData({
  organizationId,
  userId,
  dataType,
  format = 'csv',
  filters = {},
}) {
  if (!VALID_DATA_TYPES.includes(dataType)) {
    throw ApiError.validation('Invalid data type.', { data_type: 'Invalid.' });
  }
  if (!VALID_FORMATS.includes(format)) {
    throw ApiError.validation('Invalid format.', { format: 'Invalid.' });
  }

  const rows = await repo.fetchExportData({
    dataType,
    organizationId,
    filters,
  });

  const fileName = `${dataType}_${timestamp()}.${format}`;
  let content;
  if (format === 'csv') {
    content = toCsv(rows);
  } else {
    content = JSON.stringify(rows, null, 2);
  }

  await repo.createExportLog({
    organizationId,
    userId,
    dataType,
    format,
    fileName,
    rowCount: rows.length,
    filters,
  });

  return {
    file_name: fileName,
    content,
    row_count: rows.length,
    format,
    data_type: dataType,
  };
}

export async function listRecentExports({ organizationId }) {
  const exports = await repo.listExports({ organizationId, limit: 20 });
  return { exports };
}