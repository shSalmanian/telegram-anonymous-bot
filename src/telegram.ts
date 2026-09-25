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