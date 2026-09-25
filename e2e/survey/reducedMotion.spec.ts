import type { Page } from "@playwright/test";
import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "prefers-reduced-motion";

const json = {
  elements: [
    { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
    { type: "text", name: "q2", visibleIf: "{q1} = 'Yes'" },
  ],
};

async function enableAnimations(page: Page, options: { respectReducedMotion: boolean }): Promise<void> {
  await page.evaluate(({ respectReducedMotion }) => {
    const settings = (window as any).Survey.settings;
    settings.animationEnabled = true;
    settings.respectReducedMotion = respectReducedMotion;
  }, options);
}

// Records every enter/leave animation class that appears inside the survey root.
async function trackAnimationClasses(page: Page): Promise<void> {
  await page.evaluate(() => {
    const self: any = window;
    self.__animationClasses = [];
    const collect = (el: Element) => {
      el.classList.forEach((cls) => {
        if (/--(enter|leave)$/.test(cls)) self.__animationClasses.push(cls);
      });
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "attributes") collect(m.target as Element);
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) collect(node as Element);
        });
      });
    });
    observer.observe(self.survey.rootElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  });
}

async function getAnimationClasses(page: Page): Promise<Array<string>> {
  return await page.evaluate(() => (window as any).__animationClasses);
}

async function toggleVisibilityQ2(page: Page): Promise<void> {
  await page.locator("label").filter({ hasText: "Yes" }).locator("span").first().click();
  await expect(page.locator("div[data-name='q2']")).toBeVisible();
  await page.locator("label").filter({ hasText: "No" }).locator("span").first().click();
  await expect(page.locator("div[data-name='q2']")).toHaveCount(0);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("no enter/leave animations when the user requests reduced motion", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await initSurvey(page, framework, json);
      await enableAnimations(page, { respectReducedMotion: true });
      await trackAnimationClasses(page);

      await toggleVisibilityQ2(page);

      expect((await getAnimationClasses(page)).length).toEqual(0);
    });

    test("enter/leave animations run when respectReducedMotion is false", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await initSurvey(page, framework, json);
      await enableAnimations(page, { respectReducedMotion: false });
      await trackAnimationClasses(page);

      await toggleVisibilityQ2(page);

      expect((await getAnimationClasses(page)).length).toBeGreaterThan(0);
    });

    test("root css follows the OS preference without a reload", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await enableAnimations(page, { respectReducedMotion: true });
      const root = page.locator(".sd-root-modern").first();

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(root).not.toHaveClass(/sd-root-modern--animation-disabled/);

      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(root).toHaveClass(/sd-root-modern--animation-disabled/);

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(root).not.toHaveClass(/sd-root-modern--animation-disabled/);
    });
  });
});
