import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";
import * as hotelBookingForm from "./custom-theme-demos/hotel-booking-form-template-free";
import * as orderForm from "./custom-theme-demos/order-form-template-free";
import * as onlineCheckInForm from "./custom-theme-demos/online-check-in-form-template-free";
import * as patientRegistrationForm from "./custom-theme-demos/patient-registration-form-template-free";
import * as petHotelReservationForm from "./custom-theme-demos/pet-hotel-reservation-form-template-free";
import * as carRentalForm from "./custom-theme-demos/car-rental-form-template-free";
import * as issueReport from "./custom-theme-demos/issue-report-template-free";
import * as salesContractForm from "./custom-theme-demos/sales-contract-form-template-free";
import * as conferenceRegistrationForm from "./custom-theme-demos/conference-registration-form-template-free";
import * as feedbackForm from "./custom-theme-demos/feedback-form-template-free";

const title = "Legacy themes Screenshot";

async function initThemedSurvey(page: Page, framework: string, json: any, theme: any, afterInit?: () => Promise<void>) {
  await page.addStyleTag({
    content: "html, body, #surveyElement { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }"
  });
  await initSurvey(page, framework, json, false, { autoFocusFirstQuestion: false }, async () => {
    await page.evaluate((themeJson) => {
      (window as any).survey.applyTheme(themeJson);
    }, theme);
    if (afterInit) {
      await afterInit();
    }
  });
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
  await compareScreenshot(page, undefined, screenshotName, {
    timeout: 20000,
    ...(mask ? { mask } : {})
  });
}

frameworks.filter(framework => framework === "react").forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.setTimeout(120000);

    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Hotel Booking Form", async ({ page }) => {
      await page.setViewportSize({ width: 1542, height: 853 });
      await initThemedSurvey(page, framework, hotelBookingForm.survey, hotelBookingForm.theme);

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();
      const checkIn = page.getByPlaceholder("Check-in");
      const checkOut = page.getByPlaceholder("Check-out");
      const dateMask = [checkIn, checkOut];

      await screenshotRoot(page, "themes-hotel-booking-form-1.png", dateMask);

      await nextBtn.click();
      await screenshotRoot(page, "themes-hotel-booking-form-2.png", dateMask);

      await completeBtn.click();
      await page.setViewportSize({ width: 1542, height: 532 });
      await screenshotRoot(page, "themes-hotel-booking-form-completed-page.png", dateMask);
    });

    test("Order Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 1273 });
      await initThemedSurvey(page, framework, orderForm.survey, orderForm.theme);

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-order-form-1.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-order-form-2.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-order-form-3.png");

      await nextBtn.click();
      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 812 });
      await screenshotRoot(page, "themes-order-form-completed-page.png");
    });

    test("Online Check-In Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 1973 });
      await initThemedSurvey(page, framework, onlineCheckInForm.survey, onlineCheckInForm.theme);

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-online-check-in-form-1.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 1278 });
      await screenshotRoot(page, "themes-online-check-in-form-completed-page.png");
    });

    test("Patient Registration Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 2473 });
      await initThemedSurvey(page, framework, patientRegistrationForm.survey, patientRegistrationForm.theme, async () => {
        await page.evaluate(() => {
          (window as any).survey.getQuestionByName("photo").setPropertyValue("currentMode", "file");
        });
      });

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-patient-registration-form-1.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 1612 });
      await screenshotRoot(page, "themes-patient-registration-form-completed-page.png");
    });

    test("Pet Hotel Reservation Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 873 });
      await initThemedSurvey(page, framework, petHotelReservationForm.survey, petHotelReservationForm.theme);

      const nextBtn = page.locator(".sd-navigation__next-btn").first();
      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-pet-hotel-reservation-form-1.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-2.png");

      await nextBtn.click();
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-3.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 545 });
      await screenshotRoot(page, "themes-pet-hotel-reservation-form-completed-page.png");
    });

    test("Car Rental Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 2973 });
      await initThemedSurvey(page, framework, carRentalForm.survey, carRentalForm.theme);

      await screenshotRoot(page, "themes-car-rental-form-1.png");
    });

    test("Issue Report", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 1473 });
      await initThemedSurvey(page, framework, issueReport.survey, issueReport.theme);

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-issue-report-1.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 945 });
      await screenshotRoot(page, "themes-issue-report-completed-page.png");
    });

    test("Sales Contract Form", async ({ page }) => {
      await page.setViewportSize({ width: 1179, height: 873 });
      await initThemedSurvey(page, framework, salesContractForm.survey, salesContractForm.theme);

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();
      const date = page.getByPlaceholder("date");
      const dateMask = [date];

      await screenshotRoot(page, "themes-sales-contract-form-1.png", dateMask);

      await page.setViewportSize({ width: 1542, height: 2273 });
      await screenshotRoot(page, "themes-sales-contract-form-2.png", dateMask);

      await completeBtn.click();
      await page.setViewportSize({ width: 1542, height: 1478 });
      await screenshotRoot(page, "themes-sales-contract-form-completed-page.png");
    });

    test("Conference Registration Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 2273 });
      await initThemedSurvey(page, framework, conferenceRegistrationForm.survey, conferenceRegistrationForm.theme);

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-conference-registration-form-1.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 1478 });
      await screenshotRoot(page, "themes-conference-registration-form-completed-page.png");
    });

    test("Feedback Form", async ({ page }) => {
      await page.setViewportSize({ width: 1005, height: 1973 });
      await initThemedSurvey(page, framework, feedbackForm.survey, feedbackForm.theme);

      const completeBtn = page.locator(".sd-navigation__complete-btn").first();

      await screenshotRoot(page, "themes-feedback-form-1.png");

      await completeBtn.click();
      await page.setViewportSize({ width: 1005, height: 1278 });
      await screenshotRoot(page, "themes-feedback-form-completed-page.png");
    });
  });
});
