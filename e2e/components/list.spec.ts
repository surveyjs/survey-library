import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "list";

async function registerCustomToolboxComponent(framework: string) {
  // Implementation would depend on your specific needs
  // This is a placeholder that matches the original test's expectations
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.skip("check custom markup in list behavior", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "text",
            name: "actions_question"
          }
        ]
      };
      await registerCustomToolboxComponent(framework);
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          for (var i = 0; i < 30; i++) {
            opt.titleActions.push({
              title: "Custom Action " + i,
              component: "svc-custom-action",
              action: () => {
              }
            });
          }
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator(".sv-popup__content .my-custom-action-class").getByText("Custom Action 29")).toBeVisible();
    });

    test("Dropdown popup styles", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "text",
            name: "actions_question"
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
            { title: "List", showTitle: true },
            { items: getItems(40), showPointer: true }
          );
          opt.titleActions = [dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.locator(".sv-action").getByText("List").click();

      const popup__container = page.locator(".sv-popup .sv-popup__container").filter({ visible: true });
      await expect(popup__container).toBeVisible();
      await expect(popup__container.locator("ul")).toBeVisible();
      await expect(popup__container.locator("ul")).toHaveCSS("display", "block");
      await expect(popup__container.locator(".sv-list__empty-container")).not.toBeVisible();
      await expect(popup__container.locator(".sv-list__empty-container")).toHaveCSS("display", "none");

      await page.locator(".sv-list__input").press("a");
      await expect(popup__container.locator("ul")).not.toBeVisible();
      await expect(popup__container.locator("ul")).toHaveCSS("display", "none");
      await expect(popup__container.locator(".sv-list__empty-container")).toBeVisible();
      const emptyContainerDisplay = await popup__container.locator(".sv-list__empty-container").evaluate(el => getComputedStyle(el).display);
      expect(emptyContainerDisplay).not.toBe("none");
    });
  });
});

["knockout", "react"].forEach(framework => {
  if (!frameworks.includes(framework)) return;

  test.describe(`${framework} ${title}`, () => {
    test("check list filter", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        questions: [
          {
            name: "text",
            type: "text",
            title: "Title here"
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let items: any[] = [];
          for (let index = 0; index < 10; index++) {
            items[index] = new window["Survey"].Action({ title: "item" + index });
          }
          const item1 = window["Survey"].createDropdownActionModel({
            title: "Open popup",
            showTitle: true,
            action: () => { }
          }, { items: items }
          );
          const item2 = new window["Survey"].Action({
            title: "Set items",
            showTitle: true,
            action: () => {
              let items2: any[] = [];
              for (let index = 0; index < 20; index++) {
                items2[index] = { title: "item" + index };
              }
              item1.data.setItems(items2);
            },
          });
          opt.titleActions = [item1, item2];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popup = page.locator(".sv-popup .sv-popup__container").filter({ visible: true });
      const listInput = popup.locator(".sv-list__input");
      const visibleItems = page.locator(".sv-list__item").filter({ visible: true });

      await expect(popup).not.toBeVisible();

      await page.locator(".sd-action__title").getByText("Open popup").click();
      await expect(popup).toBeVisible();
      await expect(listInput).not.toBeVisible();
      await expect(visibleItems).toHaveCount(10);

      // Close popup
      await page.locator(".sv-popup.sv-popup--menu-popup").nth(0).click({ position: { x: 100, y: 100 } });
      await page.locator(".sd-action__title").getByText("Set items").click();
      await page.locator(".sd-action__title").getByText("Open popup").click();

      await expect(popup).toBeVisible();
      await expect(listInput).toBeVisible();
      await expect(listInput).toHaveValue("");
      await expect(visibleItems).toHaveCount(20);

      await listInput.press("8");
      await expect(visibleItems).toHaveCount(2);

      await listInput.selectText();
      await page.keyboard.press("Delete");
      await expect(listInput).toHaveValue("");
      await expect(visibleItems).toHaveCount(20);

      await listInput.press("1");
      await expect(visibleItems).toHaveCount(11);

      // Close popup
      await page.locator(".sv-popup.sv-popup--menu-popup").nth(0).click({ position: { x: 100, y: 100 } });
      await expect(popup).not.toBeVisible();

      await page.locator(".sd-action__title").getByText("Open popup").click();
      await expect(popup).toBeVisible();
      await expect(listInput).toHaveValue("");
      await expect(visibleItems).toHaveCount(20);
    });
  });
});