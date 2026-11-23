import type { BrowserContext, Page } from "@playwright/test";
import { pickMetrics, pickHeapUsage } from "../harness/cdp.ts";

// The bridge to CDP Performance.getMetrics (harness/cdp.ts): the page calls window.__perfMetrics() at the points it
// counts, always outside a sample's timed run. Exposed before page.goto.
export async function exposeMetrics(context: BrowserContext, page: Page): Promise<void> {
  const cdp = await context.newCDPSession(page);
  await cdp.send("Performance.enable");
  await page.exposeBinding("__perfMetrics", async(): Promise<{ [name: string]: number }> => {
    const res: any = await cdp.send("Performance.getMetrics");
    return pickMetrics(res.metrics);
  });
  // A full collection from a task of its own, with no JS on the stack: gc() from page code may scan the stack
  // conservatively and keep detached DOM nodes alive, which made the leak counters jump between runs.
  await page.exposeBinding("__perfCollectGarbage", async(): Promise<void> => {
    await cdp.send("HeapProfiler.collectGarbage");
  });
  // The V8 and Blink heaps (harness/cdp.ts, pickHeapUsage); read after a full collection.
  await page.exposeBinding("__perfHeapUsage", async(): Promise<{ [name: string]: number }> => {
    const res: any = await cdp.send("Runtime.getHeapUsage");
    return pickHeapUsage(res);
  });
}
