import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import {
  getScrollBehavior,
  isAnimationEnabled,
  isReducedMotionPreferred,
  reducedMotionMediaQuery,
  subscribeReducedMotionChange
} from "../src/utils/reduced-motion";
import { describe, expect, test } from "vitest";

function setReducedMotion(matches: boolean): void {
  (globalThis as any).__setMatchMedia(reducedMotionMediaQuery, matches);
}

describe("prefers-reduced-motion", () => {
  test("isAnimationEnabled follows animationEnabled and the media query", () => {
    settings.animationEnabled = false;
    settings.respectReducedMotion = true;
    setReducedMotion(false);
    expect(isAnimationEnabled()).toBe(false);
    expect(getScrollBehavior()).toBe("auto");

    settings.animationEnabled = true;
    expect(isReducedMotionPreferred()).toBe(false);
    expect(isAnimationEnabled()).toBe(true);
    expect(getScrollBehavior()).toBe("smooth");

    setReducedMotion(true);
    expect(isReducedMotionPreferred()).toBe(true);
    expect(isAnimationEnabled()).toBe(false);
    expect(getScrollBehavior()).toBe("auto");

    settings.respectReducedMotion = false;
    expect(isReducedMotionPreferred()).toBe(false);
    expect(isAnimationEnabled()).toBe(true);
    expect(getScrollBehavior()).toBe("smooth");
  });

  test("animationAllowed stays off while reduced motion is requested", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const question = survey.getAllQuestions()[0];
    question.supportOnElementRerenderedEvent = false;
    settings.animationEnabled = true;
    settings.respectReducedMotion = true;
    setReducedMotion(false);
    expect(question.animationAllowed).toBe(true);
    setReducedMotion(true);
    expect(question.animationAllowed).toBe(false);
    settings.respectReducedMotion = false;
    expect(question.animationAllowed).toBe(true);
    survey.dispose();
  });

  test("root css tracks the media query while the survey is rendered", () => {
    settings.animationEnabled = true;
    settings.respectReducedMotion = true;
    setReducedMotion(true);
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const disabledClass = survey.css.rootAnimationDisabled;
    expect(survey.rootCss.indexOf(disabledClass) > -1, "the preference is not read before mount").toBe(false);

    const root = document.createElement("div");
    document.body.appendChild(root);
    survey.afterRenderSurvey(root);
    expect(survey.rootCss.indexOf(disabledClass) > -1, "the preference is applied after mount").toBe(true);

    setReducedMotion(false);
    expect(survey.rootCss.indexOf(disabledClass) > -1).toBe(false);

    setReducedMotion(true);
    expect(survey.rootCss.indexOf(disabledClass) > -1).toBe(true);

    survey.beforeDestroySurveyElement();
    setReducedMotion(false);
    expect(survey.rootCss.indexOf(disabledClass) > -1).toBe(true);

    survey.dispose();
    root.remove();
  });

  test("subscribeReducedMotionChange notifies and can be removed", () => {
    setReducedMotion(false);
    let calls = 0;
    const unsubscribe = subscribeReducedMotionChange(() => { calls++; });
    setReducedMotion(true);
    setReducedMotion(false);
    expect(calls).toBe(2);
    unsubscribe();
    setReducedMotion(true);
    expect(calls).toBe(2);
  });
});
