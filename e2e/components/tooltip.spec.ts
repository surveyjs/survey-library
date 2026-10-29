import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "Tooltip";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });

    test("icon-only action shows the custom tooltip instead of the native one", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate(() => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [new window["Survey"].Action({ id: "delete", title: "Delete", iconName: "icon-delete-24x24", showTitle: false })];
        });
        window["survey"].fromJSON({ elements: [{ type: "text", name: "q1" }] });
      });

      const button = page.locator(".sd-question__title button[data-sv-tooltip='Delete']");
      await expect(button).toHaveAttribute("title", "Delete");

      const tooltip = page.locator(".sv-tooltip--visible");
      await button.hover();
      await expect(tooltip).toHaveText("Delete");
      expect(await tooltip.evaluate((el) => el.matches(":popover-open"))).toBe(true);
      await expect(button).not.toHaveAttribute("title");

      const buttonBox = await button.boundingBox();
      const tooltipBox = await tooltip.boundingBox();
      expect(Math.round(tooltipBox!.y - (buttonBox!.y + buttonBox!.height))).toBe(8);

      await page.mouse.move(0, 0);
      await expect(tooltip).toHaveCount(0);
      await expect(button).toHaveAttribute("title", "Delete");
    });
  });
});
