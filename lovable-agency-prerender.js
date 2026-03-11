import fs from "node:fs/promises";
import path from "node:path";
import { preview } from "vite";
import { PlaywrightCrawler } from "crawlee";

const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: "silent" });

await fs.rm("dist-ssr", { recursive: true, force: true });
await fs.mkdir("dist-ssr", { recursive: true });
await fs.copyFile("dist/index.html", "dist-ssr/404.html");

await new PlaywrightCrawler({
  minConcurrency: 3,
  maxConcurrency: 12,
  maxRequestsPerCrawl: 300,
  requestHandlerTimeoutSecs: 8,

  preNavigationHooks: [
    async ({ page }) => {
      await page.route("**/*", (route) => {
        const type = route.request().resourceType();
        const url = route.request().url();
        if (["image", "font", "media", "stylesheet", "ping", "websocket", "manifest", "other"].includes(type)) return route.abort();
        if (type === "script" && !url.startsWith("http://localhost:4174")) return route.abort();
        return route.continue();
      });
    },
  ],

  async requestHandler({ request, page, enqueueLinks }) {
    const { pathname } = new URL(request.url);
    if (pathname.includes(".")) return;

    await page.waitForLoadState("networkidle").catch(() => {});

    console.log(`  ✓ ${pathname}`);

    const html = await page.content();

    const outPath = path.join("dist-ssr", pathname, "index.html");
    const flatPath = path.join("dist-ssr", pathname) + ".html";

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, "utf8");

    if (pathname !== "/") {
      await fs.copyFile(outPath, flatPath);
    }

    await enqueueLinks({
      strategy: "all",
      globs: ["http://localhost:4174/**"],
      transformRequestFunction: (req) => {
        try { return new URL(req.url).pathname.includes(".") ? false : req; } catch { return false; }
      },
    });
  },
}).run(["http://localhost:4174/"]);

await server.close();

await fs.cp("dist-ssr", "dist", { recursive: true });
await fs.rm("dist-ssr", { recursive: true, force: true });
