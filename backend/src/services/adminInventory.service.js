import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminInventory.repository.js';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const VALID_TX_TYPES = ['add', 'usage', 'transfer', 'adjustment'];

function shapeInventory(row) {
  const loc = Array.isArray(row.inventory_locations)
    ? row.inventory_locations[0]
    : row.inventory_locations;
  return {
    id: row.id,
    location_id: row.location_id,
    location_name: loc?.name ?? 'Unknown',
    location_city: loc?.city ?? '',
    location_state: loc?.state ?? '',
    blood_group: row.blood_group,
    units_available: row.units_available,
    expiry_date: row.expiry_date,
    status: row.status,
    updated_at: row.updated_at,
  };
}

export async function getInventoryOverview({ locationId, bloodGroup, search }) {
  const [rows, locations, stats] = await Promise.all([
    repo.listInventory({ locationId, bloodGroup, search }),
    repo.listLocations(),
    repo.getStats(),
  ]);

  return {
    items: rows.map(shapeInventory),
    locations,
    stats,
  };
}

export async function recordTransaction({
  inventoryId,
  type,
  units,
  notes,
  userId,
}) {
  if (!VALID_TX_TYPES.includes(type)) {
    throw ApiError.validation('Invalid transaction type.', {
      type: 'Invalid.',
    });
  }
  const n = Number(units);
  if (!Number.isInteger(n) || n === 0) {
    throw ApiError.validation('Units must be a non-zero integer.', {
      units: 'Invalid.',
    });
  }
  if (type === 'add' && n < 0) {
    throw ApiError.validation('Add units must be positive.');
  }
  if (type === 'usage' && n < 0) {
    throw ApiError.validation('Usage units must be positive.');
  }

  const inv = await repo.findInventoryById(inventoryId);
  if (!inv) throw ApiError.notFound('Inventory item not found.');

  let delta;
  if (type === 'add') delta = Math.abs(n);
  else if (type === 'usage' || type === 'transfer') delta = -Math.abs(n);
  else delta = n; // adjustment: can be + or -

  const newUnits = (inv.units_available ?? 0) + delta;
  if (newUnits < 0) {
    throw ApiError.validation(
      `Not enough units. Available: ${inv.units_available}.`,
    );
  }

  const updated = await repo.updateInventoryUnits(
    inventoryId,
    newUnits,
    userId,
  );

  await repo.insertTransaction({
    inventory_id: inventoryId,
    transaction_type: type,
    units: delta,
    reference_type: null,
    reference_id: null,
    notes: notes?.trim() || null,
    created_by: userId,
  });

  return shapeInventory(updated);
}

export async function listTransactions({ limit }) {
  return repo.listTransactions({ limit });
}