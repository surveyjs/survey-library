import type { Locator, Page } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, resizeToMobile, baseTest as test } from "../e2e/helper";

const title = "Rich text Screenshots";
const question = ".sd-question";
const area = ".sd-rich-text__area";
const hideCaret = { caret: "hide" as const };
const formatted = "<p>A <strong>bold</strong> and <em>italic</em> line.</p><p><s>Struck</s> and <a href=\"https://surveyjs.io\">a link</a>.</p><ul><li>One</li><li>Two</li></ul>";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.addStyleTag({ content: "::selection { background: #c5d8f6; color: #161616; }" });
    });

    test("Empty placeholder, focused toolbar and a pressed button", async ({ page }) => {
      await open(page, framework, { placeholder: "Type your comment" });
      await compareScreenshot(page, question, "richtext-placeholder.png");

      await page.locator(area).click();
      await compareScreenshot(page, question, "richtext-static-focused.png", hideCaret);

      await page.keyboard.type("Hello");
      await selectText(page.locator(area), "Hello", "Hello");
      await page.getByRole("button", { name: "Bold", exact: true }).click();
      await compareScreenshot(page, page.getByRole("toolbar", { name: "Formatting" }), "richtext-pressed.png", hideCaret);
    });

    test("Formatted content", async ({ page }) => {
      await open(page, framework);
      await setValue(page, formatted);
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-formatted.png");
    });

    test("Read-only and display mode", async ({ page }) => {
      await open(page, framework, { readOnly: true });
      await setValue(page, formatted);
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-readonly.png");

      await initSurvey(page, framework, survey({ }), false, { mode: "display" });
      await setValue(page, formatted);
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-display.png");
    });

    test("Inline mode and a hidden toolbar", async ({ page }) => {
      await open(page, framework, { acceptCarriageReturn: false });
      await setValue(page, "One<br>two");
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-inline.png");

      await open(page, framework, { richTextToolbarMode: "none" });
      await page.locator(area).click();
      await compareScreenshot(page, question, "richtext-none.png", hideCaret);
    });

    test("Selection toolbar and the link dialog", async ({ page }) => {
      await open(page, framework, { richTextToolbarMode: "onSelection" });
      await setValue(page, "Select this text");
      await selectText(page.locator(area), "this", "this");
      await compareScreenshot(page, ".sd-body", "richtext-onselection.png", hideCaret);

      await page.getByRole("button", { name: "Link", exact: true }).click();
      const dialog = page.locator(".sv-popup__container").filter({ visible: true });
      await dialog.locator("input").fill("https://surveyjs.io");
      await compareScreenshot(page, dialog, "richtext-link-dialog.png", hideCaret);
    });

    test("Mobile width and a dark theme", async ({ page }) => {
      await open(page, framework);
      await setValue(page, formatted);
      await resizeToMobile(page);
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-mobile.png");

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        (window as any).survey.applyTheme((window as any).SurveyTheme.DefaultDarkPanelless);
      });
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "richtext-dark.png");
    });
  });
});

function survey(element: Record<string, unknown>): Record<string, unknown> {
  return {
    showQuestionNumbers: "off",
    width: "1200px",
    elements: [{ type: "richtext", name: "q", title: "Comment", ...element }]
  };
}

async function open(page: Page, framework: string, element: Record<string, unknown> = {}): Promise<void> {
  await initSurvey(page, framework, survey(element));
}

async function setValue(page: Page, value: string): Promise<void> {
  await page.evaluate((html) => {
    (window as any).survey.setValue("q", html);
  }, value);
}

async function selectText(editor: Locator, start: string, end: string): Promise<void> {
  await editor.evaluate((element, marks) => {
    const root = element as HTMLElement;
    root.focus();
    const texts: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while(current) {
      texts.push(current as Text);
      current = walker.nextNode();
    }
    const full = texts.map(node => node.textContent || "").join("");
    const at = (index: number): { node: Text, offset: number } => {
      let cursor = 0;
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i].textContent || "";
        if (cursor + text.length >= index) return { node: texts[i], offset: index - cursor };
        cursor += text.length;
      }
      const last = texts[texts.length - 1];
      return { node: last, offset: (last.textContent || "").length };
    };
    const from = at(full.indexOf(marks.start));
    const to = at(full.indexOf(marks.end) + marks.end.length);
    const range = document.createRange();
    range.setStart(from.node, from.offset);
    range.setEnd(to.node, to.offset);
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  }, { start, end });
}
