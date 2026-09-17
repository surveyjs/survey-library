import type { Page } from "@playwright/test";
import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "autoCenterFocusedQuestion horizontal visibility";

const columnCount = 6;
const tolerance = 2;

interface IFixtureOptions {
  autoCenter?: boolean;
  fitToContainer?: boolean;
  rtl?: boolean;
  animation?: boolean;
  rowCount?: number;
  targetRow?: number;
  targetCol: number;
  // Where the matrix's horizontal scroller stands before validation: the inline start, the inline end, or an offset from the start.
  preScroll: "start" | "end" | number;
}

interface IGeometry {
  isActive: boolean;
  isMobile: boolean;
  hasHorizontalOverflow: boolean;
  scrollLeft: number;
  insideHorizontally: boolean;
  insideVertically: boolean;
  isHitTestable: boolean;
  questionFits: boolean;
  centerOffset: number;
}

function createJson(options: IFixtureOptions): any {
  const rowCount = options.rowCount || 2;
  const texts = (prefix: string) => Array.from({ length: 6 }, (_, i) => ({ type: "text", name: prefix + (i + 1) }));
  const defaultValue: any = {};
  for (let r = 0; r < rowCount; r++) {
    const row: any = {};
    for (let c = 0; c < columnCount; c++) {
      if (r !== (options.targetRow || 0) || c !== options.targetCol) {
        row["col" + c] = "value";
      }
    }
    defaultValue["row" + r] = row;
  }
  return {
    fitToContainer: options.fitToContainer !== false,
    autoFocusFirstQuestion: false,
    elements: [
      ...texts("before"),
      {
        type: "matrixdropdown",
        name: "matrix",
        cellType: "text",
        columns: Array.from({ length: columnCount }, (_, c) => ({ name: "col" + c, isRequired: true, minWidth: "200px" })),
        rows: Array.from({ length: rowCount }, (_, r) => "row" + r),
        defaultValue: defaultValue
      },
      ...texts("after")
    ]
  };
}

async function setHostSize(page: Page, options: IFixtureOptions): Promise<void> {
  await page.evaluate(([fitToContainer, rtl]) => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const host = document.getElementById("surveyElement") as HTMLElement;
    if (rtl) {
      document.documentElement.dir = "rtl";
    }
    host.style.width = "700px";
    const inner = host.shadowRoot?.querySelector("div") as HTMLElement;
    if (fitToContainer) {
      host.style.height = "600px";
      host.style.overflow = "hidden";
      if (inner) {
        inner.style.height = "100%";
        inner.style.overflow = "hidden";
      }
    }
  }, [options.fitToContainer !== false, !!options.rtl]);
}

// Geometry of the target cell input against the scrollers that clip it. Everything is looked up
// through the survey root node, so the same code runs in the shadow-root mode.
async function getGeometry(page: Page, options: IFixtureOptions): Promise<IGeometry> {
  return await page.evaluate(([targetRow, targetCol, tolerance]) => {
    const survey = (window as any).survey;
    const root = survey.rootElement.getRootNode();
    const matrix = survey.getQuestionByName("matrix");
    const inputId = matrix.visibleRows[targetRow].cells[targetCol].question.inputId;
    const input = root.querySelector("#" + inputId) as HTMLElement;
    const questionEl = root.querySelector(".sd-question[data-name='matrix']") as HTMLElement;
    let hScroller = input.parentElement as HTMLElement;
    while(!!hScroller && !(["auto", "scroll"].indexOf(getComputedStyle(hScroller).overflowX) > -1 && hScroller.scrollWidth > hScroller.clientWidth)) {
      hScroller = hScroller.parentElement as HTMLElement;
    }
    const inputRect = input.getBoundingClientRect();
    let insideHorizontally = false;
    if (hScroller) {
      const left = hScroller.getBoundingClientRect().left + hScroller.clientLeft;
      insideHorizontally = inputRect.left >= left - tolerance && inputRect.right <= left + hScroller.clientWidth + tolerance;
    }
    const vScroller = questionEl.closest(".sv-scroll__scroller") as HTMLElement;
    let viewTop = 0;
    let viewHeight = window.innerHeight;
    if (vScroller && survey.fitToContainer) {
      const rect = vScroller.getBoundingClientRect();
      viewTop = rect.top;
      viewHeight = rect.height;
    }
    const insideVertically = inputRect.top >= viewTop - tolerance && inputRect.bottom <= viewTop + viewHeight + tolerance;
    const questionRect = questionEl.getBoundingClientRect();
    // Sticky row headers can cover a cell that is geometrically inside the scroller, so hit-test the input center.
    const hit = root.elementFromPoint(inputRect.left + inputRect.width / 2, inputRect.top + inputRect.height / 2);
    return {
      isActive: root.activeElement === input,
      isMobile: survey.isMobile,
      hasHorizontalOverflow: !!hScroller,
      scrollLeft: hScroller ? hScroller.scrollLeft : 0,
      insideHorizontally: insideHorizontally,
      insideVertically: insideVertically,
      isHitTestable: !!hit && (hit === input || input.contains(hit) || hit.contains(input) && hit.closest("td") === input.closest("td")),
      questionFits: questionRect.height <= viewHeight,
      centerOffset: Math.abs((questionRect.top + questionRect.height / 2) - (viewTop + viewHeight / 2))
    };
  }, [options.targetRow || 0, options.targetCol, tolerance]);
}

async function preScroll(page: Page, options: IFixtureOptions): Promise<void> {
  await page.evaluate(([preScroll, rtl]) => {
    const root = (window as any).survey.rootElement.getRootNode();
    const scroller = root.querySelector(".sd-question[data-name='matrix'] .sd-question__content") as HTMLElement;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const offset = preScroll === "start" ? 0 : (preScroll === "end" ? max : <number>preScroll);
    // In RTL the scroll offset grows negative from the inline start.
    scroller.scrollLeft = rtl ? -offset : offset;
  }, [options.preScroll, !!options.rtl] as [string | number, boolean]);
}

async function runFixture(page: Page, framework: string, options: IFixtureOptions): Promise<{ before: IGeometry, after: IGeometry }> {
  await initSurvey(page, framework, createJson(options), false, { autoCenterFocusedQuestion: options.autoCenter !== false });
  await setHostSize(page, options);
  await expect(page.locator(".sd-question[data-name='matrix']")).toBeVisible();
  if (options.animation) {
    await page.evaluate(() => { (window as any).Survey.settings.animationEnabled = true; });
  }
  await preScroll(page, options);
  const before = await getGeometry(page, options);
  expect(before.isMobile, "the matrix is rendered as a table").toBe(false);
  expect(before.hasHorizontalOverflow, "the fixture overflows horizontally").toBe(true);
  expect(before.isActive).toBe(false);

  // The library's validation path focuses the first cell with an error.
  const isValid = await page.evaluate(() => (window as any).survey.validate(true, true));
  expect(isValid).toBe(false);

  await expect.poll(async () => {
    const g = await getGeometry(page, options);
    return { isActive: g.isActive, insideHorizontally: g.insideHorizontally, insideVertically: g.insideVertically, isHitTestable: g.isHitTestable };
  }, { message: "the focused cell input is active and visible inside its scrollers" }).toEqual(
    { isActive: true, insideHorizontally: true, insideVertically: true, isHitTestable: true });
  if (options.autoCenter !== false && !options.rowCount) {
    await expect.poll(async () => (await getGeometry(page, options)).centerOffset).toBeLessThan(24);
  }
  return { before, after: await getGeometry(page, options) };
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("An error cell clipped on the right is revealed and its question is centered", async ({ page }) => {
      const { before, after } = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start" });
      expect(before.insideHorizontally, "the target starts clipped").toBe(false);
      expect(after.questionFits).toBe(true);
      expect(after.scrollLeft).toBeGreaterThan(0);
    });

    test("An error cell clipped on the left is revealed and not covered by the sticky row header", async ({ page }) => {
      const { before, after } = await runFixture(page, framework, { targetCol: 0, preScroll: "end" });
      expect(before.insideHorizontally, "the target starts clipped").toBe(false);
      expect(after.scrollLeft).toBeLessThan(before.scrollLeft);
    });

    test("A horizontally visible error cell does not move its scroller", async ({ page }) => {
      const { before, after } = await runFixture(page, framework, { targetCol: 1, preScroll: 30 });
      expect(before.insideHorizontally, "the target starts horizontally visible").toBe(true);
      expect(before.scrollLeft).toBe(30);
      expect(after.scrollLeft).toBe(30);
    });

    test("A clipped error cell is revealed while a smooth centering animation runs", async ({ page }) => {
      const { before } = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start", animation: true });
      expect(before.insideHorizontally).toBe(false);
    });

    test("A clipped error cell is revealed when centering is disabled", async ({ page }) => {
      const { before } = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start", autoCenter: false });
      expect(before.insideHorizontally).toBe(false);
    });

    test("A clipped error cell is revealed with document scrolling", async ({ page }) => {
      const { before, after } = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start", fitToContainer: false });
      expect(before.insideHorizontally).toBe(false);
      expect(after.scrollLeft).toBeGreaterThan(0);
    });

    test("A clipped error cell is revealed in RTL on either side", async ({ page }) => {
      const end = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start", rtl: true });
      expect(end.before.insideHorizontally).toBe(false);
      expect(end.after.scrollLeft).toBeLessThan(0);
      await page.goto(`${url}${framework}`);
      const start = await runFixture(page, framework, { targetCol: 0, preScroll: "end", rtl: true });
      expect(start.before.insideHorizontally).toBe(false);
      expect(start.after.scrollLeft).toBeGreaterThan(start.before.scrollLeft);
    });

    test("A clipped error cell of a matrix taller than the container stays visible", async ({ page }) => {
      const { before, after } = await runFixture(page, framework, { targetCol: columnCount - 1, preScroll: "start", rowCount: 20, targetRow: 14 });
      expect(before.insideHorizontally).toBe(false);
      expect(after.questionFits).toBe(false);
    });
  });
});
