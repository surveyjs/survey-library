import type { Locator, Page } from "@playwright/test";
import { frameworks, url, initSurvey, getSurveyData, test, expect } from "../helper";

const title = "rich text";
const area = ".sd-rich-text__area";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("toolbar and shortcuts store bold, italic and strikethrough", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("hello");
      await selectText(editor, "hello", "hello");
      await tool(page, "Bold").click();
      await commit(page);
      expect(await questionValue(page)).toBe("<strong>hello</strong>");

      await selectText(editor, "hello", "hello");
      await editor.press("Control+B");
      await commit(page);
      expect(await questionValue(page)).toBe("hello");

      await selectText(editor, "hello", "hello");
      await editor.press("Control+I");
      await commit(page);
      expect(await questionValue(page)).toBe("<em>hello</em>");

      await selectText(editor, "hello", "hello");
      await tool(page, "Strikethrough").click();
      await commit(page);
      expect(await questionValue(page)).toBe("<s>hello</s>");
    });

    test("text without formatting is stored as typed", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("Tom & Jerry");
      await commit(page);
      expect(await questionValue(page)).toBe("Tom & Jerry");

      await editor.click();
      await page.keyboard.press("Control+A");
      await page.keyboard.type("a < b");
      await commit(page);
      expect(await questionValue(page)).toBe("a < b");
    });

    test("bold on a mixed selection follows the worked example", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      await setEditorHtml(page, "Please <strong>read</strong> the <em>terms</em> carefully");
      const editor = page.locator(area);
      await expect(editor).toContainText("carefully");
      await selectText(editor, "ead the ter", "ead the ter");
      await tool(page, "Bold").click();
      await commit(page);
      expect(await questionValue(page)).toBe("Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully");

      await selectText(editor, "ead the ter", "ead the ter");
      await tool(page, "Bold").click();
      await commit(page);
      expect(await questionValue(page)).toBe("Please <strong>r</strong>ead the <em>terms</em> carefully");
    });

    test("a list of three lines toggles off, splits in the middle, and changes type", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("one");
      await page.keyboard.press("Enter");
      await page.keyboard.type("two");
      await page.keyboard.press("Enter");
      await page.keyboard.type("three");
      await page.keyboard.press("Control+A");
      await tool(page, "Bulleted list").click();
      await expect(tool(page, "Bulleted list")).toHaveAttribute("aria-pressed", "true");
      await commit(page);
      expect(await questionValue(page)).toBe("<ul><li>one</li><li>two</li><li>three</li></ul>");

      await editor.click();
      await page.keyboard.press("Control+Z");
      await commit(page);
      expect(await questionValue(page)).toBe("<p>one</p><p>two</p><p>three</p>");

      await editor.click();
      await page.keyboard.press("Control+A");
      await tool(page, "Bulleted list").click();
      await tool(page, "Bulleted list").click();
      await commit(page);
      expect(await questionValue(page)).toBe("<p>one</p><p>two</p><p>three</p>");

      await editor.click();
      await page.keyboard.press("Control+A");
      await tool(page, "Bulleted list").click();
      await selectText(editor, "two", "two");
      await tool(page, "Bulleted list").click();
      await commit(page);
      expect(await questionValue(page)).toBe("<ul><li>one</li></ul><p>two</p><ul><li>three</li></ul>");

      await editor.click();
      await page.keyboard.press("Control+A");
      await tool(page, "Numbered list").click();
      await commit(page);
      expect(await questionValue(page)).toBe("<ol><li>one</li><li>two</li><li>three</li></ol>");
    });

    test("Enter and Shift+Enter inside a list", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      await setEditorHtml(page, "<ul><li><strong>abcd</strong></li></ul>");
      const editor = page.locator(area);
      await expect(editor).toContainText("abcd");
      await placeCaret(editor, "ab");
      await page.keyboard.press("Enter");
      await expect(editor.locator("li")).toHaveCount(2);
      expect(await editor.innerHTML()).toContain("<strong>ab</strong>");
      expect(await editor.innerHTML()).toContain("<strong>cd</strong>");
      await page.keyboard.press("Control+Z");
      await expect(editor.locator("li")).toHaveCount(1);

      await selectText(editor, "bc", "bc");
      await page.keyboard.press("Enter");
      expect((await editor.innerText()).replace(/\s/g, "")).toBe("ad");

      await setEditorHtml(page, "<ul><li>ab</li></ul>");
      await expect(editor).toContainText("ab");
      await placeCaret(editor, "ab");
      await editor.press("Enter");
      await expect(editor.locator("li")).toHaveCount(2);
      await editor.press("Enter");
      await expect(editor.locator("li")).toHaveCount(1);
      await expect(editor.locator("p")).toHaveCount(1);

      await setEditorHtml(page, "<p>ab</p>");
      await expect(editor).toContainText("ab");
      await placeCaret(editor, "a");
      await pressEnter(editor, true);
      await commit(page);
      expect(await questionValue(page)).toBe("a<br>b");
    });

    test("the link dialog adds, edits and removes a link", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("surveyjs");
      await page.keyboard.press("Control+A");
      await tool(page, "Link").click();
      const dialog = page.locator(".sv-popup__container").filter({ visible: true });
      await expect(editor.locator("input")).toHaveCount(0);
      await dialog.locator("input").fill("javascript:alert(1)");
      await dialog.getByRole("button", { name: "Apply" }).click();
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText("Enter a link that starts with http://, https://, or mailto:");

      await dialog.locator("input").fill("https://surveyjs.io");
      await dialog.getByRole("button", { name: "Apply" }).click();
      await expect(dialog).toBeHidden();
      await commit(page);
      expect(await questionValue(page)).toBe("<a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">surveyjs</a>");

      await selectText(editor, "surveyjs", "surveyjs");
      await tool(page, "Link").click();
      await expect(dialog.locator("input")).toHaveValue("https://surveyjs.io");
      await dialog.locator("input").fill("https://surveyjs.io/form-library");
      await dialog.getByRole("button", { name: "Apply" }).click();
      await commit(page);
      expect(await questionValue(page)).toBe("<a href=\"https://surveyjs.io/form-library\" target=\"_blank\" rel=\"noopener noreferrer\">surveyjs</a>");

      await selectText(editor, "surveyjs", "surveyjs");
      await tool(page, "Link").click();
      await dialog.locator("input").fill("");
      await dialog.getByRole("button", { name: "Apply" }).click();
      await commit(page);
      expect(await questionValue(page)).toBe("surveyjs");
    });

    test("pasted HTML keeps the text and drops styles and tables", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      await editor.click();
      await editor.evaluate((element) => {
        const data = new DataTransfer();
        data.setData("text/html", "<p style=\"color:red\">Hi</p><table><tr><td>Cell</td></tr></table>");
        data.setData("text/plain", "Hi Cell");
        element.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: data }));
      });
      await commit(page);
      const value = String(await questionValue(page));
      expect(value).not.toContain("<table");
      expect(value).not.toContain("style=");
      expect(value).toContain("Hi");
      expect(value).toContain("Cell");
    });

    test("onBlur commits on blur and onTyping commits while focused", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q", textUpdateMode: "onBlur" }] });
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("later");
      expect(await questionValue(page)).toBeFalsy();
      await commit(page);
      expect(await questionValue(page)).toBe("later");

      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q", textUpdateMode: "onTyping" }] });
      await page.locator(area).click();
      await page.keyboard.type("now");
      await expect.poll(() => questionValue(page)).toBe("now");
    });

    test("focus and blur do not rewrite a legacy value with line breaks", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      await page.evaluate(() => { (window as any).survey.setValue("q", "a\nb"); });
      const editor = page.locator(area);
      await expect(editor).toContainText("a");
      await expect(editor).toContainText("b");
      await editor.focus();
      await commit(page);
      expect(await questionValue(page)).toBe("a\nb");
    });

    test("an external value updates the editor and waits while it is focused", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q", value: "first" }] });
      const editor = page.locator(area);
      await page.evaluate(() => { (window as any).survey.setValue("q", "<strong>next</strong>"); });
      await expect(editor.locator("strong")).toHaveText("next");

      await editor.click();
      await page.evaluate(() => { (window as any).survey.setValue("q", "<em>later</em>"); });
      await expect(editor.locator("strong")).toHaveText("next");
      await commit(page);
      await expect(editor.locator("em")).toHaveText("later");
    });

    test("display and read-only render HTML and do not run scripts", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [{ type: "richtext", name: "q" }]
      }, false, { mode: "display" });
      await page.evaluate(() => {
        (window as any).survey.setValue("q", "see <a href=\"https://surveyjs.io\">site</a><img src=\"x\" onerror=\"window.__xss=1\"><script>window.__xss=1</script>");
      });
      const content = page.locator(".sd-rich-text__content");
      await expect(content.locator("a")).toHaveAttribute("target", "_blank");
      await expect(content.locator("a")).toHaveAttribute("rel", "noopener noreferrer");
      await expect(content).toContainText("site");
      await expect(content.locator("script")).toHaveCount(0);
      await expect(content.locator("img")).toHaveCount(0);
      expect(await page.evaluate(() => (window as any).__xss)).toBeFalsy();

      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q", readOnly: true }] });
      await page.evaluate(() => { (window as any).survey.setValue("q", "<strong>locked</strong>"); });
      await expect(page.locator(area)).toHaveCount(0);
      await expect(page.locator(".sd-rich-text__content strong")).toHaveText("locked");
    });

    test("disallowed HTML opens source mode until edit anyway", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      await setEditorHtml(page, "<table><tr><td>Hi</td></tr></table>");
      await expect(page.locator(".sd-rich-text__notice")).toContainText("editing its source");
      await expect(page.locator(area)).toHaveCount(0);
      await page.locator(".sd-rich-text__edit-anyway").click();
      await expect(page.locator(".sd-rich-text__notice")).toHaveCount(0);
      await expect(page.locator(area)).toContainText("Hi");
      await expect(page.locator(area).locator("table")).toHaveCount(0);
    });

    test("maxLength blocks typing and formatting does not change the count", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q", maxLength: 5 }] });
      const editor = page.locator(area);
      const counter = page.locator(".sd-formbox__character-counter");
      await editor.click();
      await page.keyboard.type("123456");
      await expect(counter).toHaveText("5/5");
      expect((await editor.innerText()).replace(/\n/g, "")).toBe("12345");
      await page.keyboard.press("Control+A");
      await tool(page, "Bold").click();
      await expect(counter).toHaveText("5/5");
      await commit(page);
      expect(await questionValue(page)).toBe("<strong>12345</strong>");
    });

    test("inline mode inserts line breaks and hides list buttons", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [{ type: "richtext", name: "q", acceptCarriageReturn: false }]
      });
      await expect(tool(page, "Bulleted list")).toHaveCount(0);
      await expect(tool(page, "Numbered list")).toHaveCount(0);
      const editor = page.locator(area);
      await editor.click();
      await page.keyboard.type("abc");
      await placeCaret(editor, "ab");
      await pressEnter(editor, false);
      await commit(page);
      expect(await questionValue(page)).toBe("ab<br>c");
    });

    test("a matrix cell is a rich editor and the grip resizes vertically", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          { type: "richtext", name: "q", value: "one" },
          {
            type: "matrixdropdown",
            name: "m",
            rows: ["r1"],
            columns: [{ name: "note", cellType: "richtext" }]
          }
        ]
      });
      await page.evaluate(() => { (window as any).survey.allowResizeComment = true; });
      const grip = page.locator(".sd-question").first().locator(".sd-rich-text__grip");
      await expect(grip).toBeVisible();
      const editor = page.locator(".sd-question").first().locator(area);
      const before = await editor.boundingBox();
      const handle = await grip.boundingBox();
      await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
      await page.mouse.down();
      await page.mouse.move(handle.x + handle.width / 2, handle.y + 60);
      await page.mouse.up();
      const after = await editor.boundingBox();
      expect(after.height).toBeGreaterThan(before.height + 20);
      expect(Math.abs(after.width - before.width)).toBeLessThan(2);
      expect(await page.evaluate(() => (window as any).survey.getQuestionByName("q").resizeStyle)).toBe("vertical");

      const cell = page.locator(".sd-question").nth(1).locator(area);
      await cell.click();
      await page.keyboard.type("cell");
      await cell.evaluate(el => (el as HTMLElement).blur());
      const data = await getSurveyData(page);
      expect(data.m.r1.note).toBe("cell");
    });

    test("toolbar modes show and hide the formatting buttons", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      const editor = page.locator(area);
      const bold = tool(page, "Bold");
      await expect(bold).toBeVisible();
      const editorBox = await editor.boundingBox();
      const boldBox = await bold.boundingBox();
      expect(boldBox.y).toBeGreaterThan(editorBox.y);

      await initSurvey(page, framework, {
        elements: [{ type: "richtext", name: "q", richTextToolbarMode: "none" }]
      });
      await expect(tool(page, "Bold")).toHaveCount(0);
      const plain = page.locator(area);
      await plain.click();
      await page.keyboard.type("ab");
      await selectText(plain, "ab", "ab");
      await plain.press("Control+B");
      await commit(page);
      expect(await questionValue(page)).toBe("<strong>ab</strong>");

      await initSurvey(page, framework, {
        elements: [{ type: "richtext", name: "q", richTextToolbarMode: "onFocus" }]
      });
      await expect(page.locator(".sd-rich-text__toolbar")).toBeHidden();
      await page.locator(area).click();
      await expect(page.locator(".sd-rich-text__toolbar")).toBeVisible();

      await initSurvey(page, framework, {
        elements: [{ type: "richtext", name: "q", richTextToolbarMode: "onSelection" }]
      });
      await setEditorHtml(page, "select me");
      const floating = page.locator(".sd-rich-text__toolbar");
      const selectionEditor = page.locator(area);
      await expect(selectionEditor).toContainText("select me");
      await selectionEditor.click();
      await expect(floating).toBeHidden();
      await selectText(selectionEditor, "select", "select");
      await expect(floating).toBeVisible();
      await selectionEditor.click();
      await expect(floating).toBeHidden();
      await selectText(selectionEditor, "select", "select");
      await expect(floating).toBeVisible();
    });

    test("survey strings render HTML only with the handler", async ({ page }) => {
      await page.evaluate(() => {
        const serializer = (window as any).Survey.Serializer;
        serializer.findProperty("survey", "description").type = "html";
        serializer.findProperty("question", "title").type = "inlinehtml";
      });
      await initSurvey(page, framework, {
        title: "Tom & Jerry",
        description: "<em>Italic description</em>",
        elements: [{ type: "richtext", name: "q", title: "<strong>Bold title</strong>" }]
      });
      await expect(page.locator(".sd-description em")).toHaveCount(0);
      await expect(page.locator(".sd-description")).toContainText("Italic description");
      await expect(page.locator(".sd-question__title strong")).toHaveCount(0);

      await page.evaluate(() => {
        const survey = (window as any).survey;
        survey.onTextMarkdown.add((window as any).SurveyRichText.RichText.renderStringHandler);
        survey.locStrsChanged();
      });
      await expect(page.locator(".sd-description em")).toHaveText("Italic description");
      await expect(page.locator(".sd-question__title strong")).toHaveText("Bold title");
      await expect(page.locator(".sd-title").first()).toContainText("Tom & Jerry");
      await expect(page.locator(".sd-title").first().locator("strong")).toHaveCount(0);
    });

    test("Tab reaches the editing area and then the toolbar", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "richtext", name: "q" }] });
      await page.locator("body").click({ position: { x: 2, y: 2 } });
      const editor = page.locator(area);
      await page.keyboard.press("Tab");
      await expect(editor).toBeFocused();
      await page.keyboard.type("go");
      await page.keyboard.press("Tab");
      await expect(tool(page, "Bold")).toBeFocused();
    });
  });
});

function tool(page: Page, name: string): Locator {
  return page.locator(".sd-question").first().getByRole("button", { name: name, exact: true });
}

async function questionValue(page: Page): Promise<unknown> {
  return page.evaluate(() => (window as any).survey.getQuestionByName("q").value);
}

async function pressEnter(editor: Locator, shift: boolean): Promise<void> {
  await editor.evaluate((element, withShift) => {
    const event = new KeyboardEvent("keydown", { key: "Enter", shiftKey: withShift, bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  }, shift);
}

async function commit(page: Page): Promise<void> {
  await page.locator(area).first().evaluate(el => (el as HTMLElement).blur());
}

async function selectText(editor: Locator, start: string, end: string): Promise<void> {
  await editor.evaluate((element, marks) => {
    const root = element as HTMLElement;
    root.focus();
    const full = collectText(root);
    setRange(root, full.indexOf(marks.start), full.indexOf(marks.end) + marks.end.length);

    function collectText(node: HTMLElement): string {
      const parts: string[] = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while(current) {
        parts.push(current.textContent || "");
        current = walker.nextNode();
      }
      return parts.join("");
    }
    function setRange(node: HTMLElement, startAt: number, endAt: number): void {
      const texts: Text[] = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while(current) {
        texts.push(current as Text);
        current = walker.nextNode();
      }
      const at = (index: number): { item: Text, offset: number } => {
        let cursor = 0;
        for (let i = 0; i < texts.length; i++) {
          const text = texts[i].textContent || "";
          if (cursor + text.length >= index) return { item: texts[i], offset: index - cursor };
          cursor += text.length;
        }
        const last = texts[texts.length - 1];
        return { item: last, offset: (last.textContent || "").length };
      };
      const from = at(startAt);
      const to = at(endAt);
      const range = document.createRange();
      range.setStart(from.item, from.offset);
      range.setEnd(to.item, to.offset);
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    }
  }, { start, end });
}

async function placeCaret(editor: Locator, before: string): Promise<void> {
  await selectText(editor, before, before);
  await editor.evaluate((element) => {
    const root = element as HTMLElement;
    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    root.focus();
    document.dispatchEvent(new Event("selectionchange"));
  });
}

async function setEditorHtml(page: Page, html: string): Promise<void> {
  await page.locator(area).first().evaluate(el => (el as HTMLElement).blur());
  await page.evaluate((value) => {
    (window as any).survey.setValue("q", value);
  }, html);
}

