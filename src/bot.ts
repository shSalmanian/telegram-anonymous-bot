import type { TelegramMessage, TelegramUpdate } from "./types";

import {
  answerCallbackQuery,
  copyMessage,
  forwardMessage,
  sendMessage,
  sendMessageWithForceReply,
  sendMessageWithReplyButton,
} from "./telegram";

export interface BotContext {
  token: string;

  ownerChatId: number;
}

export async function handleUpdate(
  update: TelegramUpdate,
  context: BotContext
): Promise<void> {

  // Inform users that edited messages must be sent again
  if (update.edited_message) {
    const editedMessage = update.edited_message;

    // Don't notify the owner if the owner edits something
    if (editedMessage.chat.id !== context.ownerChatId) {
      await sendMessage(
        context.token,
        editedMessage.chat.id,
        "The owner cannot see edited messages.\nPlease send the edited message again as a new message."
      );
    }

    return;
  }

  // Owner clicked the Reply button
  if (update.callback_query) {
    await handleCallbackQuery(update, context);
    return;
  }

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

  // /start command
  if (message.text?.trim() === "/start") {
    await sendMessage(
      context.token,
      message.chat.id,
      "Hi there, now you can send messages to the owner!"
    );
  }

  // User message
  const user = message.from;

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Unknown user";

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

  // Show the user information and Reply button
  await sendMessageWithReplyButton(
    context.token,
    context.ownerChatId,
    `👤 ${displayName}`,
    `reply:${message.chat.id}`
  );
}

async function handleCallbackQuery(
  update: TelegramUpdate,
  context: BotContext
): Promise<void> {
  const callbackQuery = update.callback_query;

  if (!callbackQuery) {
    return;
  }

  // Always acknowledge the button press
  await answerCallbackQuery(
    context.token,
    callbackQuery.id
  );

  // Only the owner can use the Reply button
  if (callbackQuery.from.id !== context.ownerChatId) {
    return;
  }

  const data = callbackQuery.data;

  if (!data?.startsWith("reply:")) {
    return;
  }

  const userId = Number(data.substring("reply:".length));

  if (!Number.isSafeInteger(userId)) {
    await sendMessage(
      context.token,
      context.ownerChatId,
      "UserID not found!"
    );

    return;
  }

  await sendMessageWithForceReply(
    context.token,
    context.ownerChatId,
    `Replying to user ${userId}. Send your message now.`
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
    /^Replying to user (\d+)\. Send your message now\.$/
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

  await copyMessage(
    context.token,
    userId,
    message.chat.id,
    message.message_id
  );
}