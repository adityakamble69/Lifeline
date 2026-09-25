import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

// List conversations for the current user (with last message + other member)
export async function listConversationsForUser(userId) {
  assertDb();

  // Get conversations user is a member of
  const { data: memberships, error: memErr } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);

  if (memErr) throw ApiError.internal('Failed to fetch conversations.');
  const convIds = (memberships ?? []).map((m) => m.conversation_id);
  if (!convIds.length) return [];

  // Fetch conversations + members + latest messages
  const [convRes, memberRes, msgRes] = await Promise.all([
    supabase
      .from('conversations')
      .select('id, created_at, updated_at')
      .in('id', convIds),
    supabase
      .from('conversation_members')
      .select('conversation_id, user_id, joined_at')
      .in('conversation_id', convIds),
    supabase
      .from('messages')
      .select('id, conversation_id, sender_id, body, sent_at, read_at')
      .in('conversation_id', convIds)
      .order('sent_at', { ascending: false }),
  ]);

  const conversations = convRes.data ?? [];
  const members = memberRes.data ?? [];
  const messages = msgRes.data ?? [];

  // Group members and messages
  const membersByConv = {};
  for (const m of members) {
    if (!membersByConv[m.conversation_id]) membersByConv[m.conversation_id] = [];
    membersByConv[m.conversation_id].push(m);
  }
  const lastMsgByConv = {};
  const unreadByConv = {};
  for (const msg of messages) {
    if (!lastMsgByConv[msg.conversation_id]) {
      lastMsgByConv[msg.conversation_id] = msg;
    }
    if (!msg.read_at && msg.sender_id !== userId) {
      unreadByConv[msg.conversation_id] =
        (unreadByConv[msg.conversation_id] ?? 0) + 1;
    }
  }

  // Get user details for "other member"
  const otherUserIds = new Set();
  for (const m of members) {
    if (m.user_id !== userId) otherUserIds.add(m.user_id);
  }

  let usersById = {};
  if (otherUserIds.size > 0) {
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .in('id', [...otherUserIds]);
    usersById = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
  }

  return conversations
    .map((conv) => {
      const other = membersByConv[conv.id]?.find((m) => m.user_id !== userId);
      const otherUser = other ? usersById[other.user_id] : null;
      const lastMsg = lastMsgByConv[conv.id];
      return {
        id: conv.id,
        updated_at: conv.updated_at,
        other_user: otherUser
          ? {
              id: otherUser.id,
              name: otherUser.name,
              email: otherUser.email,
              phone: otherUser.phone,
            }
          : null,
        last_message: lastMsg
          ? {
              body: lastMsg.body,
              sent_at: lastMsg.sent_at,
              sender_id: lastMsg.sender_id,
              is_mine: lastMsg.sender_id === userId,
            }
          : null,
        unread_count: unreadByConv[conv.id] ?? 0,
      };
    })
    .sort((a, b) => {
      const ta = a.last_message?.sent_at ?? a.updated_at;
      const tb = b.last_message?.sent_at ?? b.updated_at;
      return new Date(tb).getTime() - new Date(ta).getTime();
    });
}

export async function getConversationMessages(conversationId, userId) {
  assertDb();

  // Verify membership
  const { data: mem } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!mem) throw ApiError.forbidden('You are not a member of this conversation.');

  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, sent_at, read_at, deleted_at')
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('sent_at', { ascending: true })
    .limit(200);

  if (error) throw ApiError.internal('Failed to fetch messages.');
  return data ?? [];
}

export async function insertMessage({ conversationId, senderId, body }) {
  assertDb();
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[adminMessages.insert]', error);
    throw ApiError.internal('Failed to send message.');
  }

  // Touch conversation updated_at
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function markMessagesRead(conversationId, userId) {
  assertDb();
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('[adminMessages.markRead]', error);
  }
  return true;
}

export async function getMembership(conversationId, userId) {
  assertDb();
  const { data, error } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getContactDetails(userId) {
  assertDb();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, role, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
}