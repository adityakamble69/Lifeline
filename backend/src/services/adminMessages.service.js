import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminMessages.repository.js';

export async function listConversations(userId) {
  return repo.listConversationsForUser(userId);
}

export async function getConversation(conversationId, userId) {
  const [messages, membership] = await Promise.all([
    repo.getConversationMessages(conversationId, userId),
    repo.getMembership(conversationId, userId),
  ]);

  return {
    conversation_id: conversationId,
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
      sender_id: m.sender_id,
      is_mine: m.sender_id === userId,
    })),
  };
}

export async function sendMessage({ conversationId, senderId, body }) {
  if (!body || !body.trim()) {
    throw ApiError.validation('Message cannot be empty.');
  }
  if (body.length > 5000) {
    throw ApiError.validation('Message is too long (max 5000 chars).');
  }

  const membership = await repo.getMembership(conversationId, senderId);
  if (!membership) {
    throw ApiError.forbidden('You are not a member of this conversation.');
  }

  const row = await repo.insertMessage({
    conversationId,
    senderId,
    body: body.trim(),
  });

  return {
    id: row.id,
    body: row.body,
    sent_at: row.sent_at,
    sender_id: row.sender_id,
    is_mine: true,
  };
}

export async function markRead(conversationId, userId) {
  await repo.markMessagesRead(conversationId, userId);
  return { success: true };
}

export async function getContact(contactUserId) {
  const user = await repo.getContactDetails(contactUserId);
  if (!user) throw ApiError.notFound('Contact not found.');
  return user;
}