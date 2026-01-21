import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "preprocessTitlesAndHtml";

const json = {
  questionTitleTemplate: "{no}) {title} {require}:",
  showQuestionNumbers: true,
  questionStartIndex: "A.",
  requiredMark: "(*)",
  pages: [
    {
      title: "This is the page {pageno} of {pagecount}.",
      elements: [
        {
          type: "text",
          name: "name",
          title: "Please type your name",
          isRequired: true
        },
        {
          type: "text",
          name: "email",
          title: "Please type your e-mail",
          isRequired: true,
          validators: [{ type: "email" }]
        }
      ]
    },
    {
      title: "This is the page {pageno} of {pagecount}.",
      elements: [
        {
          type: "comment",
          name: "comment",
          title: "{name}, please tell us what is on your mind"
        }
      ]
    }
  ],
  completedHtml:
    "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This is what is on your mind:</p><p>{comment}</p>"
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check title and html", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const titleLocator = page.locator("div[id$=ariaTitle][id^=sq]");
      // Check first title
      let text = "A. Please type your name (*)"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      await expect(titleLocator.first()).toBeVisible();
      await expect(await titleLocator.first().textContent()).toBe(text);

      // Check second title
      text = "B. Please type your e-mail (*)";// eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      await expect(titleLocator.nth(1)).toBeVisible();
      await expect(await titleLocator.nth(1).textContent()).toBe(text);

      // Fill first page
      await page.locator(".sd-text").nth(0).fill("wombat");
      await page.locator(".sd-text").nth(1).fill("wombat@mail.mail");
      await page.locator("button[title='Next']").click();

      // Check third title
      text = "C. wombat, please tell us what is on your mind";// eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      await expect(titleLocator.first()).toBeVisible();
      await expect(await titleLocator.first().textContent()).toBe(text);

      // Fill second page
      await page.locator("textarea").fill("fresh grasses");
      await page.locator("button[title=Complete]").click();

      // Check completed HTML
      const completedHtml = "Thank you for sharing this information with us.Your name is: wombatYour email is: wombat@mail.mailThis is what is on your mind:fresh grasses";
      await expect(page.locator(".sd-completedpage")).toHaveText(completedHtml);
    });
  });
});