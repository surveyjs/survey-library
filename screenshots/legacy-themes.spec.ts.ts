import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve } from "path";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Legacy themes Screenshot";
const surveyRoot = ".sd-root-modern";

function loadTemplateJson(templateName: string, fileName: "survey" | "theme"): any {
  return JSON.parse(readFileSync(resolve(__dirname, "..", "resources", templateName, `${fileName}.json`), "utf-8"));
}

async function initThemedSurvey(page: Page, framework: string, templateName: string, afterInit?: () => Promise<void>) {
  const json = loadTemplateJson(templateName, "survey");
  const theme = loadTemplateJson(templateName, "theme");
  await initSurvey(page, framework, json, false, { autoFocusFirstQuestion: false }, async () => {
    await page.evaluate((themeJson) => {
      (window as any).survey.applyTheme(themeJson);
    }, theme);
    if (afterInit) {
      await afterInit();
    }
  });
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const loadImage = (src: string) => new Promise<void>((resolve) => {
      if (!src) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
    const survey = (window as any).survey;
    const urls = [
      survey.backgroundImage,
      survey.logo,
      survey.header && survey.header.backgroundImage
    ].filter((src) => !!src);
    Array.from(document.images).forEach((img) => {
      if (img.src) urls.push(img.src);
    });
    await Promise.all(urls.map(loadImage));
  });
  await resetFocusToBody(page);
}

async function screenshotRoot(page: Page, screenshotName: string, mask?: Array<Locator>) {
  await resetFocusToBody(page);
  await compareScreenshot(page, surveyRoot, screenshotName, {
    timeout: 20000,
    ...(mask ? { mask } : {})
  });
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.setTimeout(120000);

    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Hotel Booking Form", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initThemedSurvey(page, framework, "hotel-booking-form-template-free");

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();
      const checkIn = page.getByPlaceholder("Check-in");
      const checkOut = page.getByPlaceholder("Check-out");
      const dateMask = [checkIn, checkOut];

      await screenshotRoot(page, "themes-hotel-booking-form-1.png", dateMask);

      await nextBtn.click();
      await screenshotRoot(page, "themes-hotel-booking-form-2.png", dateMask);

      await completeBtn.click();
      await screenshotRoot(page, "themes-hotel-booking-form-completed-page.png", dateMask);
    });

    test("Order Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1500 });
      await initThemedSurvey(page, framework, "order-form-template-free");

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-order-form-1.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-order-form-2.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-order-form-3.png");

      await nextBtn.click();
      await completeBtn.click();
      await screenshotRoot(page, "themes-order-form-completed-page.png");
    });

    test("Online Check-In Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 2200 });
      await initThemedSurvey(page, framework, "online-check-in-form-template-free");

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-online-check-in-form-1.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-online-check-in-form-completed-page.png");
    });

    test("Patient Registration Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 2700 });
      await initThemedSurvey(page, framework, "patient-registration-form-template-free", async () => {
        await page.evaluate(() => {
          (window as any).survey.getQuestionByName("photo").setPropertyValue("currentMode", "file");
        });
      });

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-patient-registration-form-1.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-patient-registration-form-completed-page.png");
    });

    test("Pet Hotel Reservation Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initThemedSurvey(page, framework, "pet-hotel-reservation-form-template-free");

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-pet-hotel-reservation-form-1.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-2.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-3.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-completed-page.png");
    });

    test("Car Rental Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 3200 });
      await initThemedSurvey(page, framework, "car-rental-form-template-free");

      await screenshotRoot(page, "themes-car-rental-form-1.png");
    });

    test("Issue Report", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1700 });
      await initThemedSurvey(page, framework, "issue-report-template-free");

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-issue-report-1.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-issue-report-completed-page.png");
    });

    test("Sales Contract Form", async ({ page }) => {
      await page.setViewportSize({ width: 1500, height: 1100 });
      await initThemedSurvey(page, framework, "sales-contract-form-template-free");

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();
      const date = page.getByPlaceholder("date");
      const dateMask = [date];

      await screenshotRoot(page, "themes-sales-contract-form-1.png", dateMask);

      await page.setViewportSize({ width: 1920, height: 2500 });
      await screenshotRoot(page, "themes-sales-contract-form-2.png", dateMask);

      await completeBtn.click();
      await screenshotRoot(page, "themes-sales-contract-form-completed-page.png");
    });

    test("Conference Registration Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 2500 });
      await initThemedSurvey(page, framework, "conference-registration-form-template-free");

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-conference-registration-form-1.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-conference-registration-form-completed-page.png");
    });

    test("Feedback Form", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 2200 });
      await initThemedSurvey(page, framework, "feedback-form-template-free");

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-feedback-form-1.png");

      await completeBtn.click();
      await screenshotRoot(page, "themes-feedback-form-completed-page.png");
    });
  });
});
