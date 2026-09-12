import { frameworks, url, setOptions, initSurvey, test, expect, getButtonByText } from "../helper";

const title = "html question";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "text",
            name: "name",
          },
          {
            type: "html",
            name: "info",
            html:
              "<table><body><row><td><img src='https://surveyjs.io/Content/Images/examples/26178-20160417.jpg' width='100px' /></td><td style='padding:20px'>You may put here any html code. For example images, <b>text</b> or <a href='https://surveyjs.io/Editor/Editor/'  target='_blank'>links</a></td></row></body></table>"
          },
          {
            type: "html",
            name: "testName",
            html: "Name: <span>{name}</span>"
          }
        ]
      };
      await initSurvey(page, framework, json);
    });

    test("check html elements", async ({ page }) => {
      const getImageExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector('table img[src="https://surveyjs.io/Content/Images/examples/26178-20160417.jpg"]')
      );
      const getBoldExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector("table b")
      );
      const getLinkExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector('table a[href="https://surveyjs.io/Editor/Editor/"]'));

      expect(getImageExistance).toBe(true);
      expect(getBoldExistance).toBe(true);
      expect(getLinkExistance).toBe(true);
    });

    test("change html", async ({ page }) => {
      await setOptions(page, "info", { html: "<h1>Wombat</h1>" });
      await expect(page.locator("h1").filter({ hasText: "Wombat" })).toBeVisible();
    });

    test("text processing", async ({ page }) => {
      await page.locator("input[type=text]").fill("John");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "John" })).toBeVisible();
    });

    [false, true].forEach((completedPage) => {
      test(`HTML font inheritance ${completedPage ? "completed page" : "question"}`, async ({ page }) => {
        const html = "<div style='font-weight:700'>" +
          "<span id='inherit-span'>Span</span><div id='inherit-div'>Div</div>" +
          "<p id='inherit-p'>Paragraph</p>" +
          "<table><tbody><tr><td id='inherit-td'>Cell</td></tr></tbody></table>" +
          "<span id='override-weight' style='font-weight:300'>Override</span></div>" +
          "<h2 id='heading-parent'><span id='heading-child'>Heading</span></h2>" +
          "<p id='default-weight'>Default paragraph</p>";
        await initSurvey(page, framework, {
          elements: [{ type: "html", name: "inheritance", html }],
          completedHtml: html
        });
        if (completedPage) {
          await getButtonByText(page, "Complete").click();
        }
        for (const tag of ["span", "div", "p", "td"]) {
          await expect(page.locator(`#inherit-${tag}`)).toHaveCSS("font-weight", "700");
        }
        await expect(page.locator("#override-weight")).toHaveCSS("font-weight", "300");
        await expect(page.locator("#default-weight")).toHaveCSS("font-weight", "400");
        await expect(page.locator("#heading-child")).toHaveCSS("font-weight", "700");
      });
    });
  });
});

