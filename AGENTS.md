# Cloudflare Workers

Before making changes involving Cloudflare Workers or Cloudflare products, retrieve the current official Cloudflare documentation. Do not rely on outdated knowledge for APIs, configuration, limits, quotas, or runtime behavior.

## Documentation

- Cloudflare Workers:
  https://developers.cloudflare.com/workers/

- Wrangler:
  https://developers.cloudflare.com/workers/wrangler/

- Workers limits:
  https://developers.cloudflare.com/workers/platform/limits/

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `npx wrangler types` after changing Worker bindings or other configuration that affects generated types.

## Node.js Compatibility

Do not assume Node.js APIs are available in Cloudflare Workers.

Before using Node.js-specific APIs, check the current Cloudflare Node.js compatibility documentation:

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Security

- Never put Telegram bot tokens, API keys, passwords, or other secrets in source code or committed configuration files.
- Use Cloudflare Worker Secrets for production secrets.
- Never log secrets, authentication tokens, or unnecessary sensitive user data.
- Do not weaken authentication, authorization, webhook validation, or secret handling without reviewing the security impact.
- Do not add dependencies when the functionality can reasonably be implemented with existing APIs.