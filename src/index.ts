import { handleUpdate } from "./bot";
import type { TelegramUpdate } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("Telegram Bot is alive!");
    }

    if (request.method === "POST" && url.pathname === "/telegram") {
      const webhookSecret = request.headers.get(
        "X-Telegram-Bot-Api-Secret-Token"
      );

      if (!webhookSecret || webhookSecret !== env.TELEGRAM_WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      const ownerChatId = Number(env.OWNER_CHAT_ID);

      if (!Number.isSafeInteger(ownerChatId)) {
        console.error("Invalid OWNER_CHAT_ID configuration.");
        return new Response("Server configuration error", {
          status: 500,
        });
      }

      let update: TelegramUpdate;

      try {
        update = (await request.json()) as TelegramUpdate;
      } catch {
        return new Response("Invalid JSON", { status: 400 });
      }

      await handleUpdate(update, {
        token: env.TELEGRAM_BOT_TOKEN,
        ownerChatId,
      });

      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  },
};