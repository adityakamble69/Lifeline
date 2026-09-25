import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminMessages.service.js';

// GET /api/v1/admin/messages/conversations
export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await service.listConversations(req.user.id);
  res.status(200).json({ success: true, data: { conversations } });
});

// GET /api/v1/admin/messages/conversations/:id
export const getConversation = asyncHandler(async (req, res) => {
  const data = await service.getConversation(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

// POST /api/v1/admin/messages/conversations/:id/messages
export const sendMessage = asyncHandler(async (req, res) => {
  const message = await service.sendMessage({
    conversationId: req.params.id,
    senderId: req.user.id,
    body: req.body?.body,
  });
  res.status(201).json({ success: true, data: { message } });
});

// POST /api/v1/admin/messages/conversations/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const result = await service.markRead(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: result });
});

// GET /api/v1/admin/messages/contact/:userId
export const getContact = asyncHandler(async (req, res) => {
  const contact = await service.getContact(req.params.userId);
  res.status(200).json({ success: true, data: { contact } });
});