export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("Telegram Bot is alive!");
    }

    if (request.method === "POST" && url.pathname === "/telegram") {
      try {
        const update = await request.json();

        console.log("Telegram update:", update);

        return new Response("OK");
      } catch {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};