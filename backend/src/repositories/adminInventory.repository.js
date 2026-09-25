import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

// ─── Inventory ─────────────────────────────────────────────────────────────
export async function listInventory({ locationId, bloodGroup, search }) {
  assertDb();

  let query = supabase
    .from('blood_inventory')
    .select(`
      id, location_id, blood_group, units_available, expiry_date, status,
      created_at, updated_at,
      inventory_locations ( id, name, city, state )
    `)
    .order('blood_group', { ascending: true });

  if (locationId && locationId !== 'all')
    query = query.eq('location_id', locationId);
  if (bloodGroup && bloodGroup !== 'Any')
    query = query.eq('blood_group', bloodGroup);

  const { data, error } = await query;
  if (error) {
    console.error('[adminInventory.list]', error);
    throw ApiError.internal('Failed to fetch inventory.');
  }

  let rows = data ?? [];
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter((r) => {
      const loc = Array.isArray(r.inventory_locations)
        ? r.inventory_locations[0]
        : r.inventory_locations;
      return (
        (loc?.name ?? '').toLowerCase().includes(s) ||
        (loc?.city ?? '').toLowerCase().includes(s) ||
        (r.blood_group ?? '').toLowerCase().includes(s)
      );
    });
  }
  return rows;
}

export async function findInventoryById(id) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_inventory')
    .select(`
      id, location_id, blood_group, units_available, expiry_date, status,
      updated_by, created_at, updated_at,
      inventory_locations ( id, name, city, state )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch inventory item.');
  return data;
}

export async function findInventoryByLocationAndGroup(locationId, bloodGroup) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_inventory')
    .select('id, units_available')
    .eq('location_id', locationId)
    .eq('blood_group', bloodGroup)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function updateInventoryUnits(id, units, updatedBy) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_inventory')
    .update({
      units_available: units,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw ApiError.internal('Failed to update inventory.');
  return data;
}

export async function insertInventory(payload) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_inventory')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[adminInventory.insert]', error);
    throw ApiError.internal('Failed to add inventory.');
  }
  return data;
}

// ─── Locations ─────────────────────────────────────────────────────────────
export async function listLocations() {
  assertDb();
  const { data, error } = await supabase
    .from('inventory_locations')
    .select('id, name, city, state, status')
    .order('name', { ascending: true });

  if (error) {
    console.error('[adminInventory.listLocations]', error);
    return [];
  }
  return data ?? [];
}

// ─── Transactions ──────────────────────────────────────────────────────────
export async function insertTransaction(payload) {
  assertDb();
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[adminInventory.insertTx]', error);
    throw ApiError.internal('Failed to log transaction.');
  }
  return data;
}

export async function listTransactions({ limit = 30, inventoryId }) {
  assertDb();
  let q = supabase
    .from('inventory_transactions')
    .select(`
      id, inventory_id, transaction_type, units, reference_type, reference_id,
      notes, created_by, created_at,
      blood_inventory!inner ( blood_group, location_id, inventory_locations ( name ) ),
      users ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (inventoryId) q = q.eq('inventory_id', inventoryId);

  const { data, error } = await q;
  if (error) {
    console.error('[adminInventory.listTx]', error);
    return [];
  }
  return (data ?? []).map((row) => {
    const inv = Array.isArray(row.blood_inventory)
      ? row.blood_inventory[0]
      : row.blood_inventory;
    const loc = Array.isArray(inv?.inventory_locations)
      ? inv.inventory_locations[0]
      : inv?.inventory_locations;
    const user = Array.isArray(row.users) ? row.users[0] : row.users;
    return {
      id: row.id,
      transaction_type: row.transaction_type,
      units: row.units,
      blood_group: inv?.blood_group ?? null,
      location_name: loc?.name ?? null,
      notes: row.notes,
      reference_type: row.reference_type,
      created_by_name: user?.name ?? null,
      created_at: row.created_at,
    };
  });
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export async function getStats() {
  assertDb();
  const { data, error } = await supabase
    .from('blood_inventory')
    .select('blood_group, units_available, expiry_date, status');

  if (error) return { total_units: 0, total_groups: 0, low_stock: 0, expiring_soon: 0, by_group: {} };

  const rows = data ?? [];
  const totalUnits = rows.reduce((s, r) => s + (r.units_available ?? 0), 0);
  const groups = new Set(rows.map((r) => r.blood_group).filter(Boolean));

  const LOW_STOCK_THRESHOLD = 5;
  const lowStock = rows.filter(
    (r) => (r.units_available ?? 0) > 0 && (r.units_available ?? 0) <= LOW_STOCK_THRESHOLD,
  ).length;

  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const expiringSoon = rows.filter((r) => {
    if (!r.expiry_date) return false;
    const d = new Date(r.expiry_date).getTime();
    return d > now && d - now <= THIRTY_DAYS;
  }).length;

  const byGroup = {};
  for (const r of rows) {
    if (!r.blood_group) continue;
    byGroup[r.blood_group] = (byGroup[r.blood_group] ?? 0) + (r.units_available ?? 0);
  }

  return {
    total_units: totalUnits,
    total_groups: groups.size,
    low_stock: lowStock,
    expiring_soon: expiringSoon,
    by_group: byGroup,
  };
}