import type { Page } from "@playwright/test";

/* A data source for a records question whose reads answer when the test says so (answerReads). The records
   are { id, col1 }; canInsert adds an insert, so that the add buttons show. */
export async function assignDeferredSource(page: Page, questionName: string, count: number, options: { canInsert?: boolean } = {}): Promise<void> {
  await page.evaluate(([questionName, count, canInsert]) => {
    const w = window as any;
    const records = Array.from({ length: count as number }, (_, i) => ({ id: i, col1: "v" + i }));
    w.readRequests = [];
    w.pendingReads = [];
    const source: any = {
      capabilities: { paging: true, filtering: true, sorting: true },
      keyField: "id",
      read: (request: any) => {
        w.readRequests.push(request);
        return new Promise(resolve => {
          w.pendingReads.push(() => resolve({ records: records.slice(request.skip, request.skip + request.take), total: records.length }));
        });
      }
    };
    if (canInsert) {
      source.insert = (record: any) => Promise.resolve(Object.assign({}, record, { id: 1000 + records.length }));
    }
    w.survey.getQuestionByName(questionName).dataSource = source;
  }, [questionName, count, !!options.canInsert] as [string, number, boolean]);
}
export async function answerReads(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as any;
    const reads = w.pendingReads;
    w.pendingReads = [];
    reads.forEach((answer: () => void) => answer());
  });
}
export async function getReadRequests(page: Page): Promise<Array<any>> {
  return await page.evaluate(() => (window as any).readRequests);
}
// The spinner turns forever: a screenshot needs it still.
export async function stopLoadingSpinners(page: Page): Promise<void> {
  await page.evaluate(() => {
    const root = (window as any).survey.rootElement.getRootNode();
    root.querySelectorAll(".sd-loading-indicator .sv-svg-icon").forEach((el: HTMLElement) => { el.style.animation = "none"; });
  });
}
