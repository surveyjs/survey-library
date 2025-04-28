import { test, expect, Page } from "@playwright/test";
import { frameworks, url, compareScreenshot } from "../e2e/helper";

const title = "Survey Popup Screenshot";

export const initSurveyPopup = async (page: Page, framework: string, json: any, isDesignMode?: boolean) => {
  await page.evaluate(([framework, json, isDesignMode]) => {
    // eslint-disable-next-line no-console
    console.error = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.warn = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.log("surveyjs console.error and console.warn override");

    const popupSurvey = new window["Survey"].PopupSurveyModel(json);
    const model = popupSurvey.survey;
    model.setDesignMode(isDesignMode);

    if (framework === "knockout") {
      popupSurvey.isExpanded = true;
      popupSurvey.allowClose = true;
      popupSurvey.closeOnCompleteTimeout = -1;
      popupSurvey.allowFullScreen = true;
      popupSurvey.show();
    } else if (framework === "jquery-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      window["$"]("#surveyElement").PopupSurvey({
        model: model,
        isExpanded: true,
        allowClose: true,
        allowFullScreen: true
      });
    } else if (framework === "survey-js-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      SurveyUI.renderPopupSurvey(model, document.getElementById("surveyElement"), {
        isExpanded: true,
        allowClose: true,
        allowFullScreen: true
      });
    } else if (framework === "react") {
      if (!!window.root) {
        window.root.unmount();
      }
      const root = window["ReactDOMClient"].createRoot(document.getElementById("surveyElement"));
      window["root"] = root;
      root.render(
        React.createElement(React.StrictMode, { children: React.createElement(SurveyReact.PopupSurvey,
          {
            model: model,
            isExpanded: true,
            allowClose: true,
            allowFullScreen: true
          }
        ) }));
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<popup-survey :survey='survey' :isExpanded='true' :allowClose='true' :allowFullScreen='true'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    } else if (framework === "angular" || framework == "vue3") {
      const isPopup = true;
      window.setSurvey(model, isPopup);
    }
    window["popupSurvey"] = popupSurvey;
    window["survey"] = model;
  }, [framework, json, isDesignMode]);
};

const json = {
  "title": "Send Feedback to the SurveyJS team",
  "description": "Need help? Visit our support page.",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "comment",
          "name": "feedback",
          "title": "Describe your feedback",
          "isRequired": true
        }
      ]
    }
  ],
  "showQuestionNumbers": "off"
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check Survey-Popup", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurveyPopup(page, framework, json);
      await compareScreenshot(page, ".sv_window", "survey-popup.png");
      await page.click(".sv_window_button_collapse");
      await compareScreenshot(page, ".sv_window", "survey-popup--collapsed.png");
    });

    test("Check Survey-Popup Full Screen Mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurveyPopup(page, framework, json);
      await page.click(".sv_window_button_full_screen");
      await compareScreenshot(page, ".sv_window", "survey-popup--full-screen.png");
    });
  });
});