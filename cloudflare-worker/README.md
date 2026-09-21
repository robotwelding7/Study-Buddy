# Study Buddy Cikgu AI Worker

This Worker keeps all Workers AI calls server-side. The GitHub Pages frontend never receives Cloudflare credentials or the system prompt.

## Architecture

```
Study Buddy (GitHub Pages)
  -> HTTPS POST
Cloudflare Worker
  -> Workers AI binding
Text response
```

The frontend answers supported vocabulary, common diagrams, and guided arithmetic locally first. It calls this Worker only when a local answer is not available.

## Deploy

Requirements: a Cloudflare account, Node.js, and Wrangler 4.36.0 or later.

1. Open a terminal in this `cloudflare-worker` directory.
2. Run `npm install`.
3. Run `npx wrangler login` and approve access in the Cloudflare page.
4. Optional live development: run `npm run dev`. Workers AI usage can incur charges even during development.
5. Run `npm run deploy`.
6. Copy the resulting URL, normally `https://study-buddy-cikgu-ai.<your-subdomain>.workers.dev`.
7. Edit the root file `ai-config.js` and set `apiUrl` to the Worker URL.
8. Commit that single public URL change. It is not a secret.

No API key is required in frontend code. The Worker uses the `AI` binding configured in `wrangler.toml`.

## Security and cost controls

- CORS only accepts `https://robotwelding7.github.io`.
- Only POST and OPTIONS requests are accepted.
- Student messages are limited to 300 characters.
- Context is limited to six short messages.
- Responses are limited to 350 model tokens and 1,800 output characters.
- A Cloudflare Rate Limiting binding allows 12 requests per client per minute.
- The browser uses a random local client identifier. This is an abuse deterrent, not strong authentication.
- Common learning questions and all bundled diagrams are served locally without an AI call.
- Technical failures are logged in the Worker and browser console; the child sees a friendly message.

For stronger production protection later, add Cloudflare Turnstile or authenticated parent-created student sessions. Do not add a shared secret to frontend JavaScript.

## Model

The Worker currently uses `@cf/meta/llama-3.1-8b-instruct-fast`. Verify model availability and pricing in the Cloudflare Workers AI catalog before deployment. The model name can be changed in `src/worker.js`.

## Manual verification

After deployment, test CORS from the Study Buddy origin, confirm rate limiting, and use Cloudflare Worker logs to inspect technical failures. Never log the full student prompt or the hidden system prompt.
