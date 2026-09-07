import { Page, Route } from "@playwright/test";
import { frameworks, url, initSurvey, test, expect, getButtonByText, getSurveyResult } from "./helper";

const title = "CSP strict policy";

// One nonce for both scripts and styles, the way real pages usually do it.
const NONCE = "e2e-nonce";

// Strict for everything the library is responsible for (style-src, font-src, img-src).
// The script-src allowances cover the needs of the test pages themselves: the react
// page loads jquery/showdown from cdnjs and react from esm.sh, and carries one inline
// module script (stamped with the nonce by the route rewrite below).
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'nonce-${NONCE}' https://cdnjs.cloudflare.com https://esm.sh`,
  `style-src 'self' 'nonce-${NONCE}' 'report-sample'`,
  "font-src 'self'",
  "img-src 'self'",
  "connect-src 'self' https://esm.sh",
].join("; ");

// Serves the test page under the strict policy. The header cannot be configured on the
// static test servers, so it is attached here; inline <script>/<style> snippets of the
// test pages (not of the library) get the nonce the same way a real page would carry it.
async function serveWithCsp(route: Route): Promise<void> {
  const response = await route.fetch();
  let body = await response.text();
  body = body.replace(/<script(?![^>]*\bsrc=)([^>]*)>/gi, `<script nonce="${NONCE}"$1>`);
  body = body.replace(/<style([^>]*)>/gi, `<style nonce="${NONCE}"$1>`);
  await route.fulfill({
    response,
    body,
    headers: { ...response.headers(), "content-security-policy": CSP },
  });
}

async function setupCspPage(page: Page, framework: string): Promise<void> {
  await page.route("**/examples_test/default/**", (route) => {
    if (route.request().resourceType() !== "document") return route.fallback();
    return serveWithCsp(route);
  });
  await page.addInitScript(() => {
    (window as any).__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (e: any) => {
      (window as any).__cspViolations.push({
        directive: e.effectiveDirective,
        blocked: e.blockedURI,
        sample: e.sample,
      });
    });
  });
  await page.goto(`${url}${framework}`);
}

async function getCspViolations(page: Page): Promise<Array<any>> {
  return await page.evaluate(() => (window as any).__cspViolations || []);
}

// The vue3 test page loads survey-core.css through a dynamic import; make sure the
// stylesheet is applied before rendering, the way a real page guarantees it.
async function waitForBaseThemeStylesheet(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const el = document.createElement("div");
    el.className = "sd-theme-root";
    document.body.appendChild(el);
    const applied = getComputedStyle(el).getPropertyValue("--sjs2-base-unit-size").trim() !== "";
    el.remove();
    return applied;
  });
}

const json = {
  showQuestionNumbers: "off",
  elements: [
    { type: "text", name: "name_q", title: "Your name" },
    { type: "checkbox", name: "check_q", choices: ["item1", "item2"] },
    {
      // The imagemap colors are applied through CSSOM instead of a style attribute.
      type: "imagemap",
      name: "map_q",
      imageLink: "/test-resources/starry-sky.jpg",
      hoverFillColor: "#ff0000",
      areas: [{ value: "val1", coords: "0,0,50,50" }],
    },
  ],
};

// Angular 12 runtime-injects the component styles of survey-angular-ui (the hide-host
// rules of ~40 components) as nonce-less <style> elements; nonce support (ngCspNonce /
// the CSP_NONCE token) only shipped in Angular 16, so a strict style-src cannot be
// satisfied at the framework level. The violations are Angular's, not the library's.
const angularSkipReason = "Angular 12 injects nonce-less component styles; ngCspNonce ships in Angular 16+";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("no violations when the stylesheet delivers the variables", async ({ page }) => {
      test.skip(framework === "angular", angularSkipReason);
      test.skip(framework === "survey-js-ui", "the js-ui test page loads survey-core.css into a shadow root, covered by the dedicated test below");
      await setupCspPage(page, framework);
      await waitForBaseThemeStylesheet(page);
      await initSurvey(page, framework, json);

      const root = page.locator(".sd-root-modern");
      await expect(root).toBeVisible();
      // The stylesheet already carries the base theme variables, so the renderer must
      // not emit the inline <style> a strict policy would refuse.
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
      expect(await page.evaluate(() => !!document.querySelector(".sd-root-modern style"))).toBeFalsy();
      expect(await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        return getComputedStyle(document.querySelector(".sd-root-modern")).getPropertyValue("--sjs2-base-unit-size").trim();
      })).not.toBe("");
      // The box-shadow resets are set per root through CSSOM.
      expect(await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        return getComputedStyle(document.querySelector(".sd-root-modern")).getPropertyValue("--sjs2-border-effect-surface-default-reset").trim();
      })).not.toBe("");
      // The fonts load from 'self' instead of fonts.gstatic.com.
      expect(await page.evaluate(async () => {
        await (document as any).fonts.ready;
        return (document as any).fonts.check("16px \"Open Sans\"");
      })).toBeTruthy();

      await page.locator("input[type=text]").fill("csp");
      await getButtonByText(page, "Complete").click();
      expect(await getSurveyResult(page)).toEqual({ name_q: "csp" });

      expect(await getCspViolations(page)).toEqual([]);
    });

    test("no stylesheet: the variables arrive through CSSOM, with no injected <style> and no configuration", async ({ page }) => {
      test.skip(framework === "angular", angularSkipReason);
      test.skip(framework === "survey-js-ui", "covered by the shadow-root test below");
      await setupCspPage(page, framework);
      await page.evaluate(() => {
        // No stylesheet on the page: the runtime falls back to an adopted
        // stylesheet, which a strict `style-src` does not police - no nonce needed.
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        document.querySelectorAll("link[rel=stylesheet]").forEach((el) => el.remove());
        (window as any).Survey.resetBaseThemeProbeCache();
      });
      await initSurvey(page, framework, json);

      await expect(page.locator(".sd-root-modern")).toBeVisible();
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
      expect(await page.evaluate(() => !!document.querySelector(".sd-root-modern style"))).toBeFalsy();
      expect(await page.evaluate(() => (document as any).adoptedStyleSheets.length)).toBeGreaterThan(0);
      expect(await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        return getComputedStyle(document.querySelector(".sd-root-modern")).getPropertyValue("--sjs2-base-unit-size").trim();
      })).not.toBe("");
      expect(await getCspViolations(page)).toEqual([]);
    });

    test("shadow root: the variables are adopted onto the shadow root itself", async ({ page }) => {
      test.skip(framework !== "survey-js-ui", "the shadow-root setup is specific to survey-js-ui");
      await setupCspPage(page, framework);
      // A trimmed copy of the js-ui branch of initSurvey: no harness <style> injection
      // and no stylesheet in the shadow root, so the library has to deliver the base
      // theme variables itself - through the shadow root's adoptedStyleSheets.
      await page.evaluate((surveyJson) => {
        const self: any = window;
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const surveyElement = document.getElementById("surveyElement")!;
        const shadowRoot = surveyElement.attachShadow({ mode: "open" });
        const rootElement = document.createElement("div");
        shadowRoot.appendChild(rootElement);
        self.Survey.settings.animationEnabled = false;
        const model = new self.Survey.Model(surveyJson);
        self.survey = model;
        self.SurveyUI.renderSurvey(model, rootElement);
      }, json);

      expect(await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const shadowRoot = document.getElementById("surveyElement")!.shadowRoot!;
        const shadowSurveyRoot = shadowRoot.querySelector(".sd-root-modern");
        return !!shadowSurveyRoot && getComputedStyle(shadowSurveyRoot).getPropertyValue("--sjs2-base-unit-size").trim() !== "";
      })).toBeTruthy();
      expect(await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const shadowRoot: any = document.getElementById("surveyElement")!.shadowRoot!;
        return !shadowRoot.querySelector("style") && shadowRoot.adoptedStyleSheets.length > 0;
      })).toBeTruthy();
      expect(await getCspViolations(page)).toEqual([]);
    });
  });
});
