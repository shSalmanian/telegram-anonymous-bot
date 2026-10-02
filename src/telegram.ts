export async function sendMessage(
  token: string,
  chatId: number,
  text: string
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    }
  );

  if (!response.ok) {
    console.error("Telegram sendMessage failed:", response.status);
    throw new Error("Failed to send Telegram message");
  }
}

export async function forwardMessage(
  token: string,
  ownerChatId: number,
  fromChatId: number,
  messageId: number
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/forwardMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ownerChatId,
        from_chat_id: fromChatId,
        message_id: messageId,
      }),
    }
  );

  if (!response.ok) {
    console.error("Telegram forwardMessage failed:", response.status);
    throw new Error("Failed to forward Telegram message");
  }
}

export async function copyMessage(
  token: string,
  targetChatId: number,
  fromChatId: number,
  messageId: number
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/copyMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        from_chat_id: fromChatId,
        message_id: messageId,
      }),
    }
  );

  if (!response.ok) {
    console.error("Telegram copyMessage failed:", response.status);
    throw new Error("Failed to copy Telegram message");
  }
}

export async function sendMessageWithReplyButton(
  token: string,
  chatId: number,
  text: string,
  callbackData: string
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "↩ Reply",
                callback_data: callbackData,
              },
            ],
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Telegram sendMessageWithReplyButton failed:",
      response.status
    );
    throw new Error("Failed to send Telegram message with reply button");
  }
}

export async function answerCallbackQuery(
  token: string,
  callbackQueryId: string
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Telegram answerCallbackQuery failed:",
      response.status
    );
    throw new Error("Failed to answer Telegram callback query");
  }
}

export async function sendMessageWithForceReply(
  token: string,
  chatId: number,
  text: string
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          force_reply: true,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Telegram sendMessageWithForceReply failed:",
      response.status
    );
    throw new Error("Failed to send Telegram force reply message");
  }
}