import type { Locator, Page } from "@playwright/test";
import { frameworks, url, initSurvey, test, expect, getVisibleSelectListItemByText } from "../helper";

const title = "Tailwind CSS 4 theme adapter";

// The adapter only reads host variables, so its CSS behaves the same in every framework. It is loaded
// from the survey-core build (themes/adapters), which the React test page serves as a static file.
const adapterUrl = "../../node_modules/survey-core/themes/adapters/tailwind4.css";

// Host tokens of a Tailwind app in dark mode (gray-900 card on a gray-950 page): the same values the
// Tailwind adapter demo switches to.
const darkHostCss = `
  :root {
    --color-card: #111827;
    --color-foreground: #f9fafb;
    --color-muted-foreground: #9ca3af;
    --color-input: #4b5563;
    --color-border: #374151;
    --color-destructive: #f87171;
    color-scheme: dark;
  }
  body { background: #030712; }
`;

async function loadAdapter(page: Page, hostCss?: string): Promise<void> {
  await page.addStyleTag({ url: adapterUrl });
  if (hostCss) {
    await page.addStyleTag({ content: hostCss });
  }
}

// Resolves any CSS color (color-mix(), oklch(), ...) to sRGB through a canvas pixel.
async function getRgb(locator: Locator, property: "color" | "background-color"): Promise<Array<number>> {
  return locator.evaluate((el, prop) => {
    const value = getComputedStyle(el).getPropertyValue(prop);
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
  }, property);
}

function luminance(rgb: Array<number>): number {
  const [r, g, b] = rgb.map(c => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Array<number>, b: Array<number>): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

async function getCenterY(locator: Locator): Promise<number> {
  const box = (await locator.boundingBox())!;
  return box.y + box.height / 2;
}

frameworks.filter(framework => framework === "react").forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1000, height: 800 });
    });

    // https://github.com/surveyjs/survey-library/issues/12173
    test("Dark mode: a hovered dropdown item keeps its text readable", async ({ page }) => {
      await loadAdapter(page, darkHostCss);
      await initSurvey(page, framework, {
        elements: [{ type: "dropdown", name: "mode", choices: ["Light", "Dark"], defaultValue: "Dark" }]
      });

      await page.locator(".sd-dropdown").click();
      const item = getVisibleSelectListItemByText(page, "Light");
      await item.hover();
      await expect(item).toHaveClass(/sd-selectlist__item--hovered/);

      await expect.poll(async () => contrast(await getRgb(item, "color"), await getRgb(item, "background-color")))
        .toBeGreaterThanOrEqual(4.5);
    });

    // https://github.com/surveyjs/survey-library/issues/12173
    test("Dark mode: a hovered checkbox keeps a dark fill", async ({ page }) => {
      await loadAdapter(page, darkHostCss);
      await initSurvey(page, framework, {
        elements: [{ type: "checkbox", name: "updates", choices: ["Product news", "Tips and tutorials"] }]
      });

      const label = page.locator(".sd-selectbase__label").filter({ hasText: "Product news" });
      const decorator = label.locator(".sd-checkbox__decorator");
      const surface = [0x11, 0x18, 0x27];
      await label.hover();

      // A subtle tint of the dark card, not survey-core's light-gray hover fill.
      await expect.poll(async () => contrast(await getRgb(decorator, "background-color"), surface))
        .toBeLessThan(1.5);
    });

    // https://github.com/surveyjs/survey-library/issues/12173
    test("Left title is vertically aligned with the editor", async ({ page }) => {
      await loadAdapter(page);
      await initSurvey(page, framework, {
        questionTitleLocation: "left",
        elements: [
          { type: "text", name: "fullName", title: "Full name" },
          { type: "dropdown", name: "role", title: "Your role", choices: ["Designer", "Developer"] },
          { type: "radiogroup", name: "contact", title: "Contact", choices: ["Email", "Phone"] },
          { type: "checkbox", name: "updates", title: "Updates", choices: ["Product news", "Tips"] }
        ]
      });

      const titleOf = (name: string) => page.locator(`[data-name='${name}'] .sd-question__title`);
      const pairs: Array<[string, Locator]> = [
        ["fullName", page.locator("[data-name='fullName'] .sd-formbox")],
        ["role", page.locator("[data-name='role'] .sd-formbox")],
        ["contact", page.locator("[data-name='contact'] .sd-item__control-label").first()],
        ["updates", page.locator("[data-name='updates'] .sd-item__control-label").first()]
      ];
      // The title has a single line, so its box center is the center of its first line. Text editors
      // are compared by their control box, choice lists by the label of the first choice.
      for (const [name, editor] of pairs) {
        const offset = (await getCenterY(titleOf(name))) - (await getCenterY(editor));
        expect(Math.abs(offset), name).toBeLessThanOrEqual(1);
      }
    });
  });
});
