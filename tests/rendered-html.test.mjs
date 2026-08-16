import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the shrimp arcade", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Shrimp Redemption: Press Start<\/title>/i);
  assert.match(html, /SHRIMP REDEMPTION:/);
  assert.match(html, /PRESS START/);
  assert.match(html, /sprites\/shrimp\.png/);
  assert.match(html, /CONSENT ALWAYS/);
  assert.doesNotMatch(html, /codex-preview|Building your site|Titty Monster/i);
});

test("keeps the GitHub Pages export and boundary-safe flow configured", async () => {
  const [arcade, layout, nextConfig, workflow] = await Promise.all([
    readFile(new URL("../app/Arcade.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(arcade, /DICK APPOINTMENT REQUESTED/);
  assert.match(arcade, /QUIT FOR TONIGHT/);
  assert.match(arcade, /Either player can change their mind anytime\./);
  assert.match(layout, /export const metadata: Metadata/);
  assert.doesNotMatch(layout, /next\/headers|generateMetadata/);
  assert.match(nextConfig, /output:\s*"export"/);
  assert.match(nextConfig, /assetPrefix:\s*"\/shrimp-appointment"/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path:\s*dist\/client/);
});
