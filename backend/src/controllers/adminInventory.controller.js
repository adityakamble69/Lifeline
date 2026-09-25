import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminInventory.service.js';

// GET /api/v1/admin/inventory
export const listInventory = asyncHandler(async (req, res) => {
  const data = await service.getInventoryOverview({
    locationId: req.query.location_id,
    bloodGroup: req.query.blood_group,
    search: req.query.search,
  });
  res.status(200).json({ success: true, data });
});

// GET /api/v1/admin/inventory/transactions
export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await service.listTransactions({
    limit: Number(req.query.limit) || 30,
  });
  res.status(200).json({ success: true, data: { transactions } });
});

// POST /api/v1/admin/inventory/:id/transaction
export const recordTransaction = asyncHandler(async (req, res) => {
  const item = await service.recordTransaction({
    inventoryId: req.params.id,
    type: req.body?.type,
    units: req.body?.units,
    notes: req.body?.notes,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, data: { item } });
});