import type { TelegramMessage, TelegramUpdate } from "./types";
import { forwardMessage, sendMessage } from "./telegram";

export interface BotContext {
  token: string;
  ownerChatId: number;
}

export async function handleUpdate(
  update: TelegramUpdate,
  context: BotContext
): Promise<void> {
  if (!update.message) {
    return;
  }

  const message = update.message;

  // Owner reply
  if (
    message.chat.id === context.ownerChatId &&
    message.reply_to_message
  ) {
    await handleOwnerReply(message, context);
    return;
  }

  // Ignore other messages sent by the owner
  if (message.chat.id === context.ownerChatId) {
    return;
  }

  // User message
  const user = message.from;

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Unknown user";

  const replyCommand = `/reply ${message.chat.id}`;

  await sendMessage(
    context.token,
    context.ownerChatId,
    `👤 ${displayName}\n${replyCommand}`
  );

  // Inform owner when the message was forwarded from another source
  if (message.forward_origin) {
    await sendMessage(
      context.token,
      context.ownerChatId,
      `${displayName} forwarded the following message from another source:`
    );
  }

  await forwardMessage(
    context.token,
    context.ownerChatId,
    message.chat.id,
    message.message_id
  );
}

async function handleOwnerReply(
  message: TelegramMessage,
  context: BotContext
): Promise<void> {
  const repliedMessage = message.reply_to_message;

  if (!repliedMessage?.text) {
    return;
  }

  const replyCommandMatch = repliedMessage.text.match(
    /(?:^|\n)\/reply\s+(\d+)\s*$/
  );

  if (!replyCommandMatch) {
    return;
  }

  const userId = Number(replyCommandMatch[1]);

  if (!Number.isSafeInteger(userId)) {
    await sendMessage(
      context.token,
      context.ownerChatId,
      "UserID not found!"
    );
    return;
  }

  if (!message.text) {
    await sendMessage(
      context.token,
      context.ownerChatId,
      "Just text messages are supported!"
    );
    return;
  }

  await sendMessage(
    context.token,
    userId,
    message.text
  );

  await sendMessage(
    context.token,
    context.ownerChatId,
    "Reply Sent! ✅"
  );
}