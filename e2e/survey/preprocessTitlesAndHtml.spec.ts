import { test, expect } from "@playwright/test";
import { frameworks, initSurvey, url } from "../helper";

const title = "preprocessTitlesAndHtml";

const json = {
  questionTitleTemplate: "{no}) {title} {require}:",
  questionStartIndex: "A",
  requiredText: "(*)",
  pages: [
    {
      title: "This is the page {pageno} of {pagecount}.",
      questions: [
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
      questions: [
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

      // Check first title
      let text = "A) Please type your name (*)";
      const firstTitle = page.locator("h5").filter({ hasText: "Please type your name (*)" });
      await expect(firstTitle).toBeVisible();

      // Check second title
      text = "B) Please type your e-mail (*)";
      const secondTitle = page.locator("h5").filter({ hasText: "Please type your e-mail (*)" });
      await expect(secondTitle).toBeVisible();

      // Fill first page
      await page.locator(".sd-text").nth(0).fill("wombat");
      await page.locator(".sd-text").nth(1).fill("wombat@mail.mail");
      await page.locator("input[value='Next']").click();

      // Check third title
      text = "C) wombat, please tell us what is on your mind";
      const thirdTitle = page.locator("h5").filter({ hasText: "wombat, please tell us what is on your mind" });
      await expect(thirdTitle).toBeVisible();

      // Fill second page
      await page.locator("textarea").fill("fresh grasses");
      await page.locator("input[value='Complete']").click();

      // Check completed HTML
      const completedHtml = "Thank you for sharing this information with us.Your name is: wombatYour email is: wombat@mail.mailThis is what is on your mind:fresh grasses";
      await expect(page.locator(".sd-completedpage")).toHaveText(completedHtml);
    });
  });
});