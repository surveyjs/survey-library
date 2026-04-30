import { QuestionRatingModel, RatingItem } from "../src/question_rating";
import { SurveyModel } from "../src/survey";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { CustomResizeObserver } from "./test-helpers";
import { RendererFactory } from "../src/rendererFactory";
import { DropdownListModel } from "../src/dropdownListModel";
import { ListModel } from "../src/list";
import { ItemValue } from "../src/itemvalue";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { settings } from "../src/settings";
import { _setIsTouch } from "../src/utils/devices";
import { PopupModel } from "../src/popup";
import { setOldTheme } from "./oldTheme";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

import { describe, test, expect } from "vitest";
test("check allowhover class in design mode", () => {
  const config = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  let survey = new SurveyModel(config);
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  expect(q1.visibleRateValues[0].className.indexOf("sv_q_rating_hover") != -1, "hover class is present").toBeTruthy();

  survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(config);
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  expect(q1.visibleRateValues[0].className.indexOf("sv_q_rating_hover") == -1, "hover class is removed in design mode").toBeTruthy();
});

test("check rating default items has owner and owner property name", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const item = q1.visibleRateValues[0];
  expect(item.locOwner).toLooseEqual(q1);
  expect(item.ownerPropertyName).toLooseEqual("rateValues");
  expect(item.getType()).toLooseEqual("ratingitem");
});
test("check rating processResponsiveness", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1["processResponsiveness"](500, 600);
  expect(q1.renderAs).toLooseEqual("default");
  q1["processResponsiveness"](600, 500);
  expect(q1.renderAs).toLooseEqual("dropdown");
});

test("check rating initResponsiveness", () => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultCss;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.afterRender(rootElement);
  expect(q1["resizeObserver"]).toBeTruthy();
  q1.dispose();
  expect(q1["resizeObserver"]).toBeFalsy();

  contentElement.remove();
  rootElement.remove();
});

test("check rating resize observer behavior", () => {
  window.requestAnimationFrame = (func: any) => !!func && func();
  const ResizeObserver = window.ResizeObserver;
  const getComputedStyle = window.getComputedStyle;
  window.ResizeObserver = <any>CustomResizeObserver;
  let currentScrollWidth = 0;
  let currentOffsetWidth = 0;
  window.getComputedStyle = <any>(() => {
    return { width: currentOffsetWidth };
  });
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);

  Object.defineProperty(rootElement, "isConnected", {
    get: () => true
  });
  Object.defineProperties(contentElement, {
    "scrollWidth": {
      get: () => currentScrollWidth,
    },
    "offsetWidth": {
      get: () => currentOffsetWidth,
    }
  }
  );
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultCss;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.afterRender(rootElement);
  expect(q1["resizeObserver"]).toBeTruthy();
  expect(q1.renderAs).toLooseEqual("default");
  currentOffsetWidth = 300;
  currentScrollWidth = 300;
  (<any>q1["resizeObserver"]).call();
  expect(q1.renderAs).toLooseEqual("default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  expect(q1.renderAs).toLooseEqual("dropdown");
  currentOffsetWidth = 400;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  expect(q1.renderAs).toLooseEqual("default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  expect(q1.renderAs).toLooseEqual("dropdown");
  q1["destroyResizeObserver"]();
  expect(q1.renderAs, "https://github.com/surveyjs/survey-creator/issues/2966: after destroying resize observer renderAs should return to default state").toLooseEqual("default");
  window.getComputedStyle = getComputedStyle;
  window.ResizeObserver = ResizeObserver;

  contentElement.remove();
  rootElement.remove();
});

test("check rating in case of state 'collapsed'", () => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  const getFuncOnStateChanged = () => {
    return q1["onPropChangeFunctions"].filter(item => item.name == "state" && item.key == "for-responsiveness")[0];
  };
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = defaultCss;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.state = "collapsed";
  q1.afterRender(rootElement);
  expect(q1["resizeObserver"]).toBeFalsy();
  expect(getFuncOnStateChanged()).toBeTruthy();
  q1.state = "expanded";
  expect(q1["resizeObserver"]).toBeTruthy();
  expect(getFuncOnStateChanged()).toBeFalsy();
  q1.dispose();
  expect(q1["resizeObserver"]).toBeFalsy();
});
test("check rating displayMode", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        displayMode: "buttons"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1["processResponsiveness"](500, 600);
  expect(q1.renderAs, "displayMode=buttons, big size, default").toLooseEqual("default");
  q1["processResponsiveness"](600, 500);
  expect(q1.renderAs, "displayMode=buttons, small size, default").toLooseEqual("default");

  q1.displayMode = "dropdown";
  q1["processResponsiveness"](500, 600);
  expect(q1.renderAs, "displayMode=dropdown, big size, dropdown").toLooseEqual("dropdown");
  q1["processResponsiveness"](600, 500);
  expect(q1.renderAs, "displayMode=dropdown, big size, dropdown").toLooseEqual("dropdown");
});
test("do not process reponsiveness when required width differs from avalailable less then 2px: #4554", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1["processResponsiveness"](502, 500)).toLooseEqual(false);
  expect(q1.renderAs, "difference too small: not processed").toLooseEqual("default");
  expect(q1["processResponsiveness"](503, 500)).toLooseEqual(true);
  expect(q1.renderAs, "difference is enough: is processed").toLooseEqual("dropdown");
  q1["processResponsiveness"](503, 500); // dummy: to reset isProcessed flag
  expect(q1["processResponsiveness"](500, 502)).toLooseEqual(false);
  expect(q1.renderAs, "difference too small: not processed").toLooseEqual("dropdown");
  expect(q1["processResponsiveness"](500, 503)).toLooseEqual(true);
  expect(q1.renderAs, "difference is enough: processed").toLooseEqual("default");
});
test("Do not process responsiveness if displayMode: 'dropdown' and set renderAs 'dropdown'", () => {
  RendererFactory.Instance.registerRenderer("rating", "dropdown", "test-renderer");
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        displayMode: "dropdown"
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.renderAs).toLooseEqual("dropdown");
  expect(q1.isDefaultRendering()).toLooseEqual(false);
  const container = document.createElement("div");
  container.innerHTML = "<div class='sd-scrollable-container'></div>";
  q1["initResponsiveness"](container);
  expect(q1["resizeObserver"]).toLooseEqual(undefined);

  survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.setJsonObject(json);
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.renderAs).toLooseEqual("default");
  expect(q1.isDefaultRendering()).toLooseEqual(true);
  RendererFactory.Instance.unregisterRenderer("rating", "dropdown");

  container.remove();
});
test("check getItemClass in display mode", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.readOnly = true;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  expect(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1).toBeTruthy();
});
test("Check numeric item values recalculation", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.visibleRateValues.length).toLooseEqual(5);
  q1.rateMax = 6;
  expect(q1.visibleRateValues.length).toLooseEqual(6);
  q1.rateStep = 2;
  expect(q1.visibleRateValues.length).toLooseEqual(3);
  q1.rateMin = 0;
  expect(q1.visibleRateValues.length).toLooseEqual(3);
});

test("Check rateValues on text change", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateValues.length).toLooseEqual(0);
  const firstItemId = q1.visibleChoices[0].uniqueId;
  q1.visibleRateValues[0].text = "abc";
  expect(q1.rateValues.length).toLooseEqual(5);
  expect(q1.visibleChoices[0].uniqueId, "renderedRateItems is cloned").toLooseEqual(firstItemId);
  q1.visibleRateValues[1].text = "abc";
  expect(q1.visibleChoices[0].uniqueId, "renderedRateItems is not cloned").toLooseEqual(firstItemId);
});
test("Check cssClasses update when dropdownListModel is set", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.css = {
    list: {
      itemSelected: "original-class-selected"
    },
    rating: {
      popup: "custom-popup-class",
      list: {
        item: "original-class"
      }
    }
  };
  survey.onUpdateQuestionCssClasses.add(function (survey, options) {
    var classes = options.cssClasses;
    classes.list = {
      item: classes.list.item += " custom-class",
      itemSelected: classes.list.itemSelected += " custom-class-selected"
    };
  });
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const dropdownListModel = new DropdownListModel(q1);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  q1.dropdownListModel = dropdownListModel;
  expect(dropdownListModel.popupModel.cssClass.includes("custom-popup-class")).toBeTruthy();
  expect(list.cssClasses.item).toLooseEqual("original-class custom-class");
  expect(list.cssClasses.itemSelected).toLooseEqual("original-class-selected custom-class-selected");
});
test("Rating question, renderedRateItems", () => {
  var rate = new QuestionRatingModel("q1");
  expect(rate.visibleRateValues.length, "There are 5 items by default").toLooseEqual(5);

  expect(rate.hasMinLabel, "Rating has no min label by default").toBeFalsy();
  expect(rate.hasMaxLabel, "Rating has no max label by default").toBeFalsy();

  rate.minRateDescription = "Worst";
  rate.maxRateDescription = "Best";

  expect(rate.visibleChoices.map(r => r.locText.renderedHtml), "List of numeric values").toEqualValues(["1", "2", "3", "4", "5"]);
  expect(rate.hasMinLabel, "Rating has min label").toBeTruthy();
  expect(rate.hasMaxLabel, "Rating has max label").toBeTruthy();

  rate.displayRateDescriptionsAsExtremeItems = true;
  expect(rate.visibleChoices.map(r => r.locText.renderedHtml), "List of numeric values and min/max").toEqualValues(["Worst", "2", "3", "4", "Best"]);
  expect(rate.hasMinLabel, "Rating has no min label").toBeFalsy();
  expect(rate.hasMaxLabel, "Rating has no max label").toBeFalsy();
});
test("Check dropdownListModel isItemSelected works correctly", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        "rateCount": 10,
        "rateValues": [1, 2],
      }
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionRatingModel>survey.getQuestionByName("q1");
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  expect(list.isItemSelected(list.actions[0])).toBeFalsy();
  expect(list.isItemSelected(list.actions[1])).toBeFalsy();

  question.value = 1;

  expect(list.isItemSelected(list.actions[0])).toBeTruthy();
  expect(list.isItemSelected(list.actions[1])).toBeFalsy();

  question.value = 2;

  expect(list.isItemSelected(list.actions[0])).toBeFalsy();
  expect(list.isItemSelected(list.actions[1])).toBeTruthy();

});
test("QuestionRating reset highlight on click", () => {
  _setIsTouch(false);
  const question = new QuestionRatingModel("q");
  question.rateType = "stars";
  question.onItemMouseIn(question.visibleChoices[2]);
  expect(question.visibleChoices.map(i => i.highlight)).toEqualValues(["highlighted", "highlighted", "highlighted", "none", "none"]);
  question.setValueFromClick("3");
  expect(question.visibleChoices.map(i => i.highlight)).toEqualValues(["none", "none", "none", "none", "none"]);
});
test("check stars highlighting", () => {
  _setIsTouch(false);
  var json = {
    elements: [
      {
        type: "rating",
        rateType: "stars",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  setOldTheme(survey);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "";
  q1.value = 2;

  expect(q1.visibleChoices.length, "Items by deafault").toLooseEqual(5);
  expect(q1.rateType, "Rate type is stars").toLooseEqual("stars");

  expect(q1.getItemClass(q1.visibleChoices[0]), "value=2 index=0").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1]), "value=2 index=1").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2]), "value=2 index=2").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3]), "value=2 index=3").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4]), "value=2 index=4").toLooseEqual("");
  q1.onItemMouseIn(q1.visibleChoices[3]);

  expect(q1.visibleChoices[0].highlight, "check highlight property #0 index=0").toLooseEqual("none");
  expect(q1.visibleChoices[1].highlight, "check highlight property #0 index=1").toLooseEqual("none");
  expect(q1.visibleChoices[2].highlight, "check highlight property #0 index=2").toLooseEqual("highlighted");
  expect(q1.visibleChoices[3].highlight, "check highlight property #0 index=3").toLooseEqual("highlighted");
  expect(q1.visibleChoices[4].highlight, "check highlight property #0 index=4").toLooseEqual("none");

  expect(q1.getItemClass(q1.visibleChoices[0]), "mouseIn #1 index=0").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1]), "mouseIn #1 index=1").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2]), "mouseIn #1 index=2").toLooseEqual("sv_q_high");
  expect(q1.getItemClass(q1.visibleChoices[3]), "mouseIn #1 index=3").toLooseEqual("sv_q_high");
  expect(q1.getItemClass(q1.visibleChoices[4]), "mouseIn #1 index=4").toLooseEqual("");

  q1.onItemMouseOut(q1.visibleChoices[3]);
  expect(q1.getItemClass(q1.visibleChoices[0]), "onItemMouseOut #1 index=0").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1]), "onItemMouseOut #1 index=1").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2]), "onItemMouseOut #1 index=2").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3]), "onItemMouseOut #1 index=3").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4]), "onItemMouseOut #1 index=4").toLooseEqual("");

  q1.value = 4;
  q1.onItemMouseIn(q1.visibleChoices[1]);
  expect(q1.getItemClass(q1.visibleChoices[0]), "mouseIn #2 index=0").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1]), "mouseIn #2 index=1").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2]), "mouseIn #2 index=2").toLooseEqual("sv_q_unhigh");
  expect(q1.getItemClass(q1.visibleChoices[3]), "mouseIn #2 index=3").toLooseEqual("sv_q_unhigh");
  expect(q1.getItemClass(q1.visibleChoices[4]), "mouseIn #2 index=4").toLooseEqual("");

  q1.onItemMouseOut(q1.visibleChoices[1]);
  survey.readOnly = true;
  q1.onItemMouseIn(q1.visibleChoices[1]);
  expect(q1.getItemClass(q1.visibleChoices[0]), "survey.mode=display index=0").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1]), "survey.mode=display index=1").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2]), "survey.mode=display index=2").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3]), "survey.mode=display index=3").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4]), "survey.mode=display index=4").toLooseEqual("");
});

test("check stars highlighting design mode", () => {
  var json = {
    elements: [
      {
        type: "rating",
        rateType: "stars",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.setDesignMode(true);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";

  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");

  q1.onItemMouseIn(q1.visibleChoices[3]);
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
});

test("check stars highlighting on touch device", () => {
  var json = {
    elements: [
      {
        type: "rating",
        rateType: "stars",
        name: "q1",
      },
    ],
  };
  _setIsTouch(true);
  const survey = new SurveyModel(json);
  survey.setDesignMode(true);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";

  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
  q1.onItemMouseIn(q1.visibleChoices[3]);
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
  _setIsTouch(false);
});

test("check stars styles", () => {
  var json = {
    elements: [
      {
        type: "rating",
        rateType: "stars",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  setOldTheme(survey);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "sv_q_selected";
  q1.cssClasses.itemStarDisabled = "";
  q1.cssClasses.itemStarReadOnly = "sv_q_readonly";
  q1.value = 2;
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
  survey.readOnly = true;
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_selected sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_readonly");
});

test("check smiley styles", () => {

  var json = {
    elements: [
      {
        type: "rating",
        rateType: "smileys",
        scaleColorMode: "monochrome",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemSmiley = "";
  q1.cssClasses.itemSmileyHover = "";
  q1.cssClasses.itemSmileyHighlighted = "sv_q_high";
  q1.cssClasses.itemSmileySelected = "sv_q_selected";
  q1.cssClasses.itemSmileyDisabled = "";
  q1.cssClasses.itemSmileyScaleColored = "sv_q_sc";
  q1.cssClasses.itemSmileyRateColored = "sv_q_rc";

  q1.value = 2;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_sc");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected sv_q_sc sv_q_rc");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_sc");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_sc");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_sc");
  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "scale";
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected sv_q_rc");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "default";
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("");
});

test("check stars for rateValues", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars",
        "rateValues": [
          "not_much",
          "a_little_bit",
          "somewhat",
          "a_lot",
          "completely"
        ],
      }]
  };
  const survey = new SurveyModel(json);
  setOldTheme(survey);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "sv_q_selected";
  q1.cssClasses.itemStarDisabled = "";
  q1.cssClasses.itemStarReadOnly = "sv_q_readonly";
  q1.value = "a_little_bit";
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[2]), "item[2] is empty").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[3]), "item[3] is empty").toLooseEqual("");
  expect(q1.getItemClass(q1.visibleChoices[4]), "item[4] is empty").toLooseEqual("");
  survey.readOnly = true;
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_selected sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[2]), "item[2] is disabled not selected").toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[3]), "item[3] is disabled not selected").toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[4]), "item[4] is disabled not selected").toLooseEqual("sv_q_readonly");
});

test("check smileys for rateValues", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars",
        "rateValues": [
          "not_much",
          "a_little_bit",
          "somewhat",
          "a_lot",
          "completely"
        ]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  q1.rateMin = 200;
  q1.rateMax = 300;
  expect(q1.getItemSmiley(q1.visibleChoices[0])).toLooseEqual("not-good");
  expect(q1.getItemSmiley(q1.visibleChoices[1])).toLooseEqual("average");
  expect(q1.getItemSmiley(q1.visibleChoices[2])).toLooseEqual("normal");
  expect(q1.getItemSmiley(q1.visibleChoices[3])).toLooseEqual("good");
  expect(q1.getItemSmiley(q1.visibleChoices[4])).toLooseEqual("very-good");
});

test("check smileys for min/max", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars"
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  q1.rateMin = 2;
  q1.rateMax = 3;
  expect(q1.getItemSmiley(q1.visibleChoices[0])).toLooseEqual("not-good");
  expect(q1.getItemSmiley(q1.visibleChoices[1])).toLooseEqual("very-good");

  q1.rateMin = 0;
  q1.rateMax = 2;
  expect(q1.getItemSmiley(q1.visibleChoices[0])).toLooseEqual("not-good");
  expect(q1.getItemSmiley(q1.visibleChoices[1])).toLooseEqual("normal");
  expect(q1.getItemSmiley(q1.visibleChoices[2])).toLooseEqual("very-good");

  q1.rateMin = 1;
  q1.rateMax = 5;
  expect(q1.getItemSmiley(q1.visibleChoices[0])).toLooseEqual("not-good");
  expect(q1.getItemSmiley(q1.visibleChoices[1])).toLooseEqual("average");
  expect(q1.getItemSmiley(q1.visibleChoices[2])).toLooseEqual("normal");
  expect(q1.getItemSmiley(q1.visibleChoices[3])).toLooseEqual("good");
  expect(q1.getItemSmiley(q1.visibleChoices[4])).toLooseEqual("very-good");
});

test("check smileys styles", () => {

  var json = {
    elements: [
      {
        type: "rating",
        rateType: "smileys",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  setOldTheme(survey);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemSmiley = "";
  q1.cssClasses.itemSmileySelected = "sv_q_selected";
  q1.cssClasses.itemSmileyDisabled = "";
  q1.cssClasses.itemSmileyReadOnly = "sv_q_readonly";
  q1.cssClasses.itemSmileyHover = "sv_q_allowhover";
  q1.value = 2;
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_allowhover");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_allowhover");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_allowhover");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_allowhover");

  survey.readOnly = true;
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_selected sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_readonly");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_readonly");
});

test("check styles on event", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  setOldTheme(survey);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.item = "sv_q_item";
  q1.cssClasses.itemFixedSize = "";
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_item");

  survey.onUpdateChoiceItemCss.add((sender, options) => {
    if (options.item.value == 2) {
      options.css = options.css + " custom";
    }
  });
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_item custom");
});

test("rating smileys max item count", () => {
  var json = {
    elements: [
      {
        type: "rating",
        rateType: "smileys",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  expect(q1.visibleChoices.length).toLooseEqual(5);
  q1.rateMax = 10;
  expect(q1.visibleChoices.length).toLooseEqual(10);
  q1.rateMax = 15;
  expect(q1.visibleChoices.length).toLooseEqual(10);

  q1.rateType = "labels";
  expect(q1.visibleChoices.length).toLooseEqual(15);
  q1.visibleChoices[0].value = "a";

  q1.rateType = "smileys";
  expect(q1.visibleChoices.length).toLooseEqual(10);
});

test("check fixed width styles", () => {

  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateMin": 0,
        "rateMax": 4,
        "minRateDescription": "mindesc",
        "maxRateDescription": "maxdesc",
        "displayRateDescriptionsAsExtremeItems": true
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.item = "sv_q_item";
  q1.cssClasses.itemHover = "";
  q1.cssClasses.itemFixedSize = "sv_q_item-fixed";

  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_item sv_q_item-fixed");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_item sv_q_item-fixed");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_item sv_q_item-fixed");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_item");
});

test("check fixed width styles - rate values", () => {

  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateValues": [
          0,
          1,
          {
            "value": 2,
            "text": "middle"
          },
          3,
          4
        ],
        "minRateDescription": "mindesc",
        "maxRateDescription": "maxdesc",
        "displayRateDescriptionsAsExtremeItems": true
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.item = "sv_q_item";
  q1.cssClasses.itemHover = "";
  q1.cssClasses.itemFixedSize = "sv_q_item-fixed";

  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item");
  expect(q1.getItemClass(q1.visibleChoices[1])).toLooseEqual("sv_q_item sv_q_item-fixed");
  expect(q1.getItemClass(q1.visibleChoices[2])).toLooseEqual("sv_q_item");
  expect(q1.getItemClass(q1.visibleChoices[3])).toLooseEqual("sv_q_item sv_q_item-fixed");
  expect(q1.getItemClass(q1.visibleChoices[4])).toLooseEqual("sv_q_item");
});

test("rateCount changing rateMin/rateMax", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.rateMax).toLooseEqual(5);

  q1.rateCount = 6;
  expect(q1.rateMax).toLooseEqual(6);
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.visibleRateValues.length).toLooseEqual(6);
});

test("rateMin/rateMax/rateStep changing rateCount", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.rateMax).toLooseEqual(5);
  expect(q1.rateCount).toLooseEqual(5);

  q1.rateMax = 6;
  expect(q1.rateMax, "rateMax #1").toLooseEqual(6);
  expect(q1.rateMin, "rateMin #1").toLooseEqual(1);
  expect(q1.visibleRateValues.length, "length #1").toLooseEqual(6);
  expect(q1.rateCount, "count #1").toLooseEqual(6);

  q1.rateMin = 2;
  expect(q1.rateMax, "rateMax #2").toLooseEqual(6);
  expect(q1.rateMin, "rateMin #2").toLooseEqual(2);
  expect(q1.visibleRateValues.length, "length #2").toLooseEqual(5);
  expect(q1.rateCount, "length #2").toLooseEqual(5);

  q1.rateStep = 3;
  expect(q1.rateMax, "rateMax #3").toLooseEqual(5);
  expect(q1.rateMin, "rateMin #3").toLooseEqual(2);
  expect(q1.visibleRateValues.length, "length #3").toLooseEqual(2);
  expect(q1.rateCount, "length #2").toLooseEqual(2);
});

test("rateStep changing rateMax", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.rateMax).toLooseEqual(5);
  expect(q1.rateCount).toLooseEqual(5);

  q1.rateMax = 6;
  expect(q1.rateMax).toLooseEqual(6);
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.visibleRateValues.length).toLooseEqual(6);
  expect(q1.rateCount).toLooseEqual(6);

  q1.rateStep = 2;
  expect(q1.rateMax).toLooseEqual(5);
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.visibleRateValues.length).toLooseEqual(3);
  expect(q1.rateCount).toLooseEqual(3);
});

test("rateValues changing rateCount", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateCount).toLooseEqual(3);

  q1.rateValues.push(new ItemValue("d"));
  expect(q1.rateCount).toLooseEqual(4);
});

test("rateCount changing rateValues", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  q1.rateCount = 2;
  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b"]);

  q1.rateCount = 4;
  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b", "item3", "item4"]);
});

test("rateMin/rateMax/rateStep does not change rateValues and rateCount", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b", "c"]);
  expect(q1.rateCount).toLooseEqual(3);

  q1.rateMax = 100;
  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b", "c"]);
  expect(q1.rateCount).toLooseEqual(3);

  q1.rateMin = 50;
  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b", "c"]);
  expect(q1.rateCount).toLooseEqual(3);

  q1.rateStep = 3;
  expect(q1.rateValues.map(i => i.value)).toEqualValues(["a", "b", "c"]);
  expect(q1.rateCount).toLooseEqual(3);
});

test("rate params loading from json", () => {
  const survey = new SurveyModel();

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMin: 2
      },
    ],
  });
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateCount, "rateCount, rateMin -> rateCount").toLooseEqual(6);
  expect(q1.rateMin, "rateCount, rateMin -> rateMin").toLooseEqual(2);
  expect(q1.rateMax, "rateCount, rateMin -> rateMax").toLooseEqual(7);

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMax: 7
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateCount, "rateCount, rateMax -> rateCount").toLooseEqual(6);
  expect(q1.rateMin, "rateCount, rateMax -> rateMin").toLooseEqual(2);
  expect(q1.rateMax, "rateCount, rateMax -> rateMax").toLooseEqual(7);

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 1,
        rateMax: 7,
        rateMin: 2
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateCount, "rateCount, rateMax -> rateCount").toLooseEqual(6);
  expect(q1.rateMin, "rateCount, rateMax -> rateMin").toLooseEqual(2);
  expect(q1.rateMax, "rateCount, rateMax -> rateMax").toLooseEqual(7);

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 1,
        rateMax: 7,
        rateMin: 2,
        rateValues: [1, 2, 3]
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateCount, "rateCount, rateMax -> rateCount").toLooseEqual(3);
  expect(q1.rateMin, "rateCount, rateMax -> rateMin").toLooseEqual(2);
  expect(q1.rateMax, "rateCount, rateMax -> rateMax").toLooseEqual(7);
});

test("autoGenerate change creates rateValues", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateMin).toLooseEqual(1);
  expect(q1.rateMax).toLooseEqual(5);
  expect(q1.rateValues.length).toLooseEqual(0);

  q1.autoGenerate = false;
  expect(q1.rateValues.length).toLooseEqual(5);
  expect(q1.rateValues[0].uniqueId, "check uniqueId #1").toLooseEqual(q1.visibleChoices[0].uniqueId);
});

test("when autoGenerate true rateValues ignored", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  q1.autoGenerate = true;
  expect(q1.visibleRateValues.map(i => i.value)).toEqualValues([1, 2, 3]);
});

test("rate autoGenerate loading from json", () => {
  const survey = new SurveyModel();

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMin: 2
      },
    ],
  });
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.autoGenerate).toBeTruthy();
  expect(q1.visibleRateValues.length).toLooseEqual(6);

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 1,
        rateMax: 7,
        rateMin: 2,
        rateValues: [1, 2, 3]
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.autoGenerate).toBeFalsy();
  expect(q1.visibleRateValues.length).toLooseEqual(3);

  survey.setJsonObject({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateCount: 1,
        rateMax: 7,
        rateMin: 2,
        rateValues: [1, 2, 3],
        autoGenerate: true
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.autoGenerate).toBeTruthy();
  expect(q1.visibleRateValues.length).toLooseEqual(6);
});

test("check icons for rateValues", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars",
        "rateValues": [1, 2]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateType = "smileys";
  expect(q1.rateValues[0].icon).toLooseEqual("not-good");
  expect(q1.rateValues[1].icon).toLooseEqual("very-good");

  q1.rateCount = 3;
  expect(q1.rateValues[0].icon).toLooseEqual("not-good");
  expect(q1.rateValues[1].icon).toLooseEqual("normal");
  expect(q1.rateValues[2].icon).toLooseEqual("very-good");
});

test("change rateCount on switch rateType", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars",
        "rateValues": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateType = "smileys";
  expect(q1.rateCount).toLooseEqual(10);
  expect(q1.rateValues.length).toLooseEqual(10);
});

test("reset rateValues on change autoGenerate", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars",
        "rateValues": [1, 2, 3]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.rateValues.length).toLooseEqual(3);
  q1.autoGenerate = true;
  expect(q1.rateValues.length).toLooseEqual(0);
});

test("rateCount limitations", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateType": "stars"
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateCount = 1;
  expect(q1.rateCount).toLooseEqual(2);
  q1.rateCount = 21;
  expect(q1.rateCount).toLooseEqual(20);
  q1.rateCount = 15;
  expect(q1.rateCount).toLooseEqual(15);
  q1.rateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  expect(q1.rateCount).toLooseEqual(22);
  q1.rateCount = 21;
  expect(q1.rateCount).toLooseEqual(21);

  q1.rateType = "smileys";
  q1.rateCount = 15;
  expect(q1.rateCount).toLooseEqual(10);
});

test("rating colors without css vars", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1"
      }
    ]
  };

  const survey = new SurveyModel(json);
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  (QuestionRatingModel as any)["colorsCalculated"] = false;
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";

  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": null });
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": null });
  expect(q1.visibleRateValues[2].style).toEqualValues({ "--sd-rating-item-color": null });
  expect(q1.visibleRateValues[3].style).toEqualValues({ "--sd-rating-item-color": null });
  expect(q1.visibleRateValues[4].style).toEqualValues({ "--sd-rating-item-color": null });
  (QuestionRatingModel as any)["colorsCalculated"] = false;
});

test("rating colors", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1"
      }
    ]
  };
  document.documentElement.style.setProperty("--sd-rating-bad-color", "#c8140a");
  document.documentElement.style.setProperty("--sd-rating-normal-color", "gold");
  document.documentElement.style.setProperty("--sd-rating-good-color", "rgb(10,200,20)");

  document.documentElement.style.setProperty("--sd-rating-bad-color-light", "rgba(200, 20, 10, 0.2)");
  document.documentElement.style.setProperty("--sd-rating-normal-color-light", "rgba(255, 215, 0, 0.2)");
  document.documentElement.style.setProperty("--sd-rating-good-color-light", "rgba(10,200,20, 0.2)");

  const survey = new SurveyModel(json);
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  (QuestionRatingModel as any)["colorsCalculated"] = false;
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  q1.afterRenderQuestionElement(rootElement);
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  expect(q1.visibleRateValues[2].style).toEqualValues({ "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  expect(q1.visibleRateValues[3].style).toEqualValues({ "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  expect(q1.visibleRateValues[4].style).toEqualValues({ "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  q1.readOnly = true;
  expect(q1.visibleRateValues[0].style, "ro 1").toEqualValues({});
  expect(q1.visibleRateValues[1].style, "ro 2").toEqualValues({});
  expect(q1.visibleRateValues[2].style, "ro 3").toEqualValues({});
  expect(q1.visibleRateValues[3].style, "ro 4").toEqualValues({});
  expect(q1.visibleRateValues[4].style, "ro 5").toEqualValues({});

  q1.readOnly = false;
  expect(q1.visibleRateValues[0].style, "ro 1 after").toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  expect(q1.visibleRateValues[1].style, "ro 2 after").toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  expect(q1.visibleRateValues[2].style, "ro 3 after").toEqualValues({ "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  expect(q1.visibleRateValues[3].style, "ro 4 after").toEqualValues({ "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  expect(q1.visibleRateValues[4].style, "ro 5 after").toEqualValues({ "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  survey.showPreview();
  let qp = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(qp.visibleRateValues[0].style, "pv 1").toEqualValues({});
  expect(qp.visibleRateValues[1].style, "pv 2").toEqualValues({});
  expect(qp.visibleRateValues[2].style, "pv 3").toEqualValues({});
  expect(qp.visibleRateValues[3].style, "pv 4").toEqualValues({});
  expect(qp.visibleRateValues[4].style, "pv 5").toEqualValues({});
  survey.cancelPreview();

  q1.onItemMouseIn(q1.visibleChoices[1]);
  expect(q1.visibleRateValues[1].style, "onItemMouseIn").toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)", "--sd-rating-item-color-light": "rgba(227, 117, 5, 0.2)" });
  q1.onItemMouseOut(q1.visibleChoices[1]);

  q1.scaleColorMode = "monochrome";
  q1.onItemMouseIn(q1.visibleChoices[1]);
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  q1.onItemMouseOut(q1.visibleChoices[1]);

  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  expect(q1.visibleRateValues[2].style).toEqualValues({ "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  expect(q1.visibleRateValues[3].style).toEqualValues({ "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  expect(q1.visibleRateValues[4].style).toEqualValues({ "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "default";

  expect(q1.visibleRateValues[0].style).toEqualValues({});
  expect(q1.visibleRateValues[1].style).toEqualValues({});
  expect(q1.visibleRateValues[2].style).toEqualValues({});
  expect(q1.visibleRateValues[3].style).toEqualValues({});
  expect(q1.visibleRateValues[4].style).toEqualValues({});
  q1.value = null;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  q1.isRequired = true;
  q1.validate();
  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });

  document.documentElement.style.setProperty("--sd-rating-bad-color", null);
  document.documentElement.style.setProperty("--sd-rating-normal-color", null);
  document.documentElement.style.setProperty("--sd-rating-good-color", null);

  document.documentElement.style.setProperty("--sd-rating-bad-color-light", null);
  document.documentElement.style.setProperty("--sd-rating-normal-color-light", null);
  document.documentElement.style.setProperty("--sd-rating-good-color-light", null);
  (QuestionRatingModel as any)["colorsCalculated"] = false;

  rootElement.remove();
});

test("rating colors when vars used", () => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1"
      }
    ]
  };
  document.documentElement.style.setProperty("--sd-rating-bad-color", "#c8140a");
  document.documentElement.style.setProperty("--sd-rating-normal-color", "gold");
  document.documentElement.style.setProperty("--sd-rating-good-color", "rgb(10,200,20)");

  document.documentElement.style.setProperty("--sd-rating-bad-color-light", "rgba(200, 20, 10, 0.2)");
  document.documentElement.style.setProperty("--sd-rating-normal-color-light", "rgba(255, 215, 0, 0.2)");
  document.documentElement.style.setProperty("--sd-rating-good-color-light", "rgba(10,200,20, 0.2)");

  const survey = new SurveyModel(json);
  survey.applyTheme({
    cssVariables: {
      "--sjs-special-red": "var(--unknown-variable)",
      "--sjs-special-yellow": "var(--unknown-variable)",
      "--sjs-special-green": "var(--unknown-variable)",
      "--sjs-special-red-light": "var(--unknown-variable)",
      "--sjs-special-yellow-light": "var(--unknown-variable)",
      "--sjs-special-green-light": "var(--unknown-variable)"
    }
  });
  let q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  (QuestionRatingModel as any)["colorsCalculated"] = false;
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  q1.afterRenderQuestionElement(rootElement);
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  expect(q1.visibleRateValues[2].style).toEqualValues({ "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  expect(q1.visibleRateValues[3].style).toEqualValues({ "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  expect(q1.visibleRateValues[4].style).toEqualValues({ "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  document.documentElement.style.setProperty("--stest-rating-bad-color", "rgb(10,200,20)");
  document.documentElement.style.setProperty("--stest-rating-normal-color", "gold");
  document.documentElement.style.setProperty("--stest-rating-good-color", "#c8140a");

  document.documentElement.style.setProperty("--stest-rating-bad-color-light", "rgba(10,200,20, 0.2)");
  document.documentElement.style.setProperty("--stest-rating-normal-color-light", "rgba(255, 215, 0, 0.2)");
  document.documentElement.style.setProperty("--stest-rating-good-color-light", "rgba(200, 20, 10, 0.2)");

  survey.applyTheme({
    cssVariables: {
      "--sjs-special-red": "var(--stest-rating-bad-color)",
      "--sjs-special-yellow": "var(--stest-rating-normal-color)",
      "--sjs-special-green": "var(--stest-rating-good-color)",
      "--sjs-special-red-light": "var(--stest-rating-bad-color-light)",
      "--sjs-special-yellow-light": "var(--stest-rating-normal-color-light)",
      "--sjs-special-green-light": "var(--stest-rating-good-color-light)"
    }
  });
  q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  expect(q1.visibleRateValues[0].style).toEqualValues({ "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  expect(q1.visibleRateValues[1].style).toEqualValues({ "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  expect(q1.visibleRateValues[2].style).toEqualValues({ "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  expect(q1.visibleRateValues[3].style).toEqualValues({ "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  expect(q1.visibleRateValues[4].style).toEqualValues({ "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });
  (QuestionRatingModel as any)["colorsCalculated"] = false;

  rootElement.remove();
});

test("check rating in-matrix mode styles", () => {

  var json = {
    elements: [
      {
        "type": "matrixdropdown",
        "name": "q",
        "columns": [
          {
            "name": "Column 1",
            "cellType": "rating",
            "rateType": "smileys"
          }
        ],
        "rows": [
          "Row 1"
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const q = survey.getQuestionByName("q") as QuestionRatingModel;
  var rows = q.visibleRows;
  var q1 = <QuestionRatingModel>rows[0].cells[0].question;

  q1.cssClasses.itemSmall = "sv_q--small";
  q1.cssClasses.root = "sv_q";

  q1.cssClasses.itemSmiley = "sv_q_item-smiley";
  q1.cssClasses.itemStar = "sv_q_item-star";
  q1.cssClasses.itemHover = "";
  q1.cssClasses.itemSmileyHover = "";
  q1.cssClasses.itemStarHover = "";
  q1.cssClasses.itemSmileySmall = "sv_q_item-smiley--small";
  q1.cssClasses.itemStarSmall = "sv_q_item-star--small";
  q1.cssClasses.rootWrappable = "";
  expect(q1.ratingRootCss).toLooseEqual("sv_q sv_q--small");
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item-smiley sv_q_item-smiley--small");

  q.columns[0].rateType = "stars";
  expect(q1.itemStarIcon).toLooseEqual("icon-rating-star-small");
  expect(q1.itemStarIconAlt).toLooseEqual("icon-rating-star-small-2");
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item-star sv_q_item-star--small");

  q.columns[0].rateType = "labels";
  expect(q1.ratingRootCss).toLooseEqual("sv_q");

  q.columns[0].rateType = "smileys";
  settings.matrix.rateSize = "normal";
  expect(q1.ratingRootCss).toLooseEqual("sv_q");
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item-smiley");

  q.columns[0].rateType = "stars";
  expect(q1.itemStarIcon).toLooseEqual("icon-rating-star");
  expect(q1.itemStarIconAlt).toLooseEqual("icon-rating-star-2");
  expect(q1.getItemClass(q1.visibleChoices[0])).toLooseEqual("sv_q_item-star");

  q.columns[0].rateType = "labels";
  expect(q1.ratingRootCss).toLooseEqual("sv_q");
  settings.matrix.rateSize = "small";
});

test("check rating in-matrix mode styles", () => {

  const survey = new SurveyModel({ elements: [{ type: "rating", name: "q1" }] });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.cssClasses.root = "sv_q";
  q1.cssClasses.rootLabelsTop = "sv_q__top";
  expect(q1.ratingRootCss).toLooseEqual("sv_q");
  q1.rateDescriptionLocation = "top";
  expect(q1.ratingRootCss).toLooseEqual("sv_q");
  q1.maxRateDescription = "Bad";
  expect(q1.ratingRootCss).toLooseEqual("sv_q sv_q__top");
});

test("check rating display-mode styles", () => {

  const survey = new SurveyModel({ elements: [{ type: "rating", name: "q1" }] });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.cssClasses.root = "sv_q-root";
  q1.cssClasses.rootWrappable = "sv_q-root__wrap";
  expect(q1.ratingRootCss).toLooseEqual("sv_q-root");
  q1.displayMode = "buttons";
  expect(q1.ratingRootCss).toLooseEqual("sv_q-root sv_q-root__wrap");
});
test("check rating display dropdown description", () => {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateCount": 10,
        "rateMax": 10,
        "minRateDescription": "aaa",
        "maxRateDescription": "bbb"
      }
    ]
  });

  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.displayMode = "dropdown";

  expect(q1.visibleRateValues[0].description.text, "min description").toEqualValues("aaa");
  expect(q1.visibleRateValues[q1.visibleRateValues.length - 1].description.text, "max description").toEqualValues("bbb");
});
test("Rating dropdown should show numeric values, not descriptions, as item text", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "rating",
      name: "q1",
      minRateDescription: "Not satisfied",
      maxRateDescription: "Extremely satisfied"
    }]
  });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.renderAs = "dropdown";

  expect(q1.visibleRateValues[0].text, "First item text should be numeric value").toLooseEqual("1");
  expect(q1.visibleRateValues[0].title, "First item title should be numeric value").toLooseEqual("1");
  expect(q1.visibleRateValues[0].description.text, "First item description should be minRateDescription").toLooseEqual("Not satisfied");
  expect(q1.visibleRateValues[4].text, "Last item text should be numeric value").toLooseEqual("5");
  expect(q1.visibleRateValues[4].title, "Last item title should be numeric value").toLooseEqual("5");
  expect(q1.visibleRateValues[4].description.text, "Last item description should be maxRateDescription").toLooseEqual("Extremely satisfied");
  expect(q1.visibleRateValues[1].text, "Middle item text should be numeric value").toLooseEqual("2");
  expect(q1.visibleRateValues[1].description, "Middle item should have no description").toBeFalsy();
});
test("Rating dropdown with explicit rateValues should show original text, not descriptions", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "rating",
      name: "q1",
      minRateDescription: "mimimi",
      maxRateDescription: "mamama",
      displayMode: "dropdown",
      rateValues: [
        { value: 1, text: "One" },
        { value: 2, text: "Two" },
        { value: 3, text: "Three" },
        { value: 4, text: "Four" }
      ]
    }]
  });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;

  expect(q1.visibleRateValues[0].text, "First item text should be the original text").toLooseEqual("One");
  expect(q1.visibleRateValues[0].title, "First item title should be the original text").toLooseEqual("One");
  expect(q1.visibleRateValues[0].description.text, "First item description should be minRateDescription").toLooseEqual("mimimi");
  expect(q1.visibleRateValues[3].text, "Last item text should be the original text").toLooseEqual("Four");
  expect(q1.visibleRateValues[3].title, "Last item title should be the original text").toLooseEqual("Four");
  expect(q1.visibleRateValues[3].description.text, "Last item description should be maxRateDescription").toLooseEqual("mamama");
});
test("Rating displayRateDescriptionsAsExtremeItems should replace text only in button mode, not dropdown", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "rating",
      name: "q1",
      minRateDescription: "Strongly Disagree",
      maxRateDescription: "Strongly Agree",
      displayRateDescriptionsAsExtremeItems: true,
      rateValues: [1, 2, 3, 4, 5]
    }]
  });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;

  expect(q1.visibleRateValues[0].locText.calculatedText, "In button mode, locText shows description").toLooseEqual("Strongly Disagree");
  expect(q1.visibleRateValues[4].locText.calculatedText, "In button mode, locText shows description").toLooseEqual("Strongly Agree");
  expect(q1.visibleRateValues[0].description, "In button mode with displayRateDescriptionsAsExtremeItems, description should be undefined to avoid duplication").toBeFalsy();
  expect(q1.visibleRateValues[4].description, "In button mode with displayRateDescriptionsAsExtremeItems, description should be undefined to avoid duplication").toBeFalsy();
  expect(q1.visibleRateValues[2].description, "Middle item should have no description in button mode").toBeFalsy();

  q1.displayMode = "dropdown";

  expect(q1.visibleRateValues[0].locText.calculatedText, "In dropdown mode, locText shows original value").toLooseEqual("1");
  expect(q1.visibleRateValues[4].locText.calculatedText, "In dropdown mode, locText shows original value").toLooseEqual("5");
  expect(q1.visibleRateValues[0].description.text, "Description available in dropdown mode").toLooseEqual("Strongly Disagree");
  expect(q1.visibleRateValues[4].description.text, "Description available in dropdown mode").toLooseEqual("Strongly Agree");
  expect(q1.visibleRateValues[2].description, "Middle item should have no description in dropdown mode").toBeFalsy();
});
test("Rating displayRateDescriptionsAsExtremeItems with empty descriptions falls back to item text", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "rating",
      name: "q1",
      displayRateDescriptionsAsExtremeItems: true,
      rateValues: [1, 2, 3, 4, 5]
    }]
  });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;

  expect(q1.visibleRateValues[0].locText.calculatedText, "With no descriptions set, text stays as value").toLooseEqual("1");
  expect(q1.visibleRateValues[4].locText.calculatedText, "With no descriptions set, text stays as value").toLooseEqual("5");
  expect(q1.visibleRateValues[0].description, "No description when minRateDescription is empty").toBeFalsy();
  expect(q1.visibleRateValues[4].description, "No description when maxRateDescription is empty").toBeFalsy();
});
test("Rating displayRateDescriptionsAsExtremeItems with rateValues having custom text", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "rating",
      name: "q1",
      minRateDescription: "Min desc",
      maxRateDescription: "Max desc",
      displayRateDescriptionsAsExtremeItems: true,
      autoGenerate: false,
      rateValues: [
        { value: "A", text: "First" },
        { value: "B", text: "Second" },
        { value: "C", text: "Third" }
      ]
    }]
  });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;

  expect(q1.visibleRateValues[0].locText.calculatedText, "In button mode, first item text replaced by minRateDescription").toLooseEqual("Min desc");
  expect(q1.visibleRateValues[2].locText.calculatedText, "In button mode, last item text replaced by maxRateDescription").toLooseEqual("Max desc");
  expect(q1.visibleRateValues[1].locText.calculatedText, "Middle item text unchanged").toLooseEqual("Second");
  expect(q1.visibleRateValues[0].description, "Description undefined in button mode for first item").toBeFalsy();
  expect(q1.visibleRateValues[2].description, "Description undefined in button mode for last item").toBeFalsy();

  q1.displayMode = "dropdown";

  expect(q1.visibleRateValues[0].locText.calculatedText, "In dropdown mode, first item shows original text").toLooseEqual("First");
  expect(q1.visibleRateValues[2].locText.calculatedText, "In dropdown mode, last item shows original text").toLooseEqual("Third");
  expect(q1.visibleRateValues[0].description.text, "In dropdown mode, description shows minRateDescription").toLooseEqual("Min desc");
  expect(q1.visibleRateValues[2].description.text, "In dropdown mode, description shows maxRateDescription").toLooseEqual("Max desc");
  expect(q1.visibleRateValues[1].description, "Middle item has no description in dropdown mode").toBeFalsy();
});
// jsdom does not perform layout, so element scrollWidth is always 0. The
// rating responsiveness logic reads `rootEl.scrollWidth` to decide between
// default and compact (dropdown) rendering. Stubbing scrollWidth as a getter
// derived from the inline styles makes this test deterministic in jsdom.
test("check rating triggerResponsiveness method", () => {
  return new Promise<void>(function(resolve) {
    let __remaining = 1;
    const __done = function() { if (--__remaining <= 0) resolve(); };

    RendererFactory.Instance.registerRenderer("rating", "dropdown", "test-renderer");
    const ResizeObserver = window.ResizeObserver;
    window.ResizeObserver = <any>CustomResizeObserver;
    const done = __done;

    const rootElement = document.createElement("div");
    const contentElement = document.createElement("div");
    const ratingElement = document.createElement("div");
    contentElement.className = "sd-scrollable-container";
    contentElement.style.width = "400px";
    contentElement.style.height = "10px";
    contentElement.style.overflow = "auto";
    ratingElement.style.width = "400px";
    ratingElement.style.height = "10px";

    contentElement.appendChild(ratingElement);
    rootElement.append(contentElement);
    document.body.appendChild(rootElement);
    // jsdom returns 0 for scrollWidth/offsetWidth; emulate the browser rule
    // scrollWidth = max(container content-width, child width). Also stub
    // offsetWidth so isContainerVisible() returns true.
    Object.defineProperty(contentElement, "scrollWidth", {
      configurable: true,
      get: () => Math.max(parseFloat(contentElement.style.width) || 0, parseFloat(ratingElement.style.width) || 0)
    });
    Object.defineProperty(contentElement, "offsetWidth", {
      configurable: true,
      get: () => parseFloat(contentElement.style.width) || 0
    });
    Object.defineProperty(contentElement, "offsetHeight", {
      configurable: true,
      get: () => parseFloat(contentElement.style.height) || 0
    });

    var json = {
      elements: [
        {
          type: "rating",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
        },
      ],
    };
    const survey = new SurveyModel(json);
    survey.css = defaultCss;
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");

    q1.afterRender(rootElement);
    q2.afterRender(rootElement);

    expect(!!q2["triggerResponsivenessCallback"], "q2 triggerResponsivenessCallback").toBeFalsy();
    expect(!!q1["triggerResponsivenessCallback"], "q1 triggerResponsivenessCallback").toBeTruthy();
    expect(q1["resizeObserver"], "q1 resizeObserver").toBeTruthy();
    expect(q1.renderAs, "q1 renderAs #1").toLooseEqual("default");

    contentElement.style.width = "350px";

    survey.triggerResponsiveness(false);
    expect(q1.renderAs, "q1 renderAs #2").toLooseEqual("dropdown");

    contentElement.style.width = "450px";
    //to reset is processed flag
    survey.triggerResponsiveness(false);

    survey.triggerResponsiveness(false);
    expect(q1.renderAs, "q1 renderAs #3").toLooseEqual("default");

    ratingElement.style.width = "500px";

    survey.triggerResponsiveness(false);
    expect(q1.renderAs, "q1 renderAs #4").toLooseEqual("default");

    survey.triggerResponsiveness(true);

    setTimeout(() => {
      expect(q1.renderAs, "q1 renderAs #5").toLooseEqual("dropdown");

      ratingElement.remove();
      contentElement.remove();
      rootElement.remove();
      RendererFactory.Instance.unregisterRenderer("rating", "dropdown");
      window.ResizeObserver = ResizeObserver;
      done();
    }, 1);

  });
});

test("check rating in-matrix pre-defined items", () => {
  var json = {
    logoPosition: "right",
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "matrixdropdown",
            name: "q",
            columns: [
              {
                name: "Column 1",
                cellType: "rating",
                rateValues: [
                  {
                    value: "item1",
                    text: "Rate Item 1"
                  },
                  {
                    value: "item2",
                    text: "Rate Item 2"
                  },
                  {
                    value: "item3",
                    text: "Rate Item 3"
                  },
                  {
                    value: "item4",
                    text: "Rate Item 4"
                  },
                  {
                    value: "item5",
                    text: "Rate Item 5"
                  }
                ]
              }
            ],
            choices: [1, 2, 3, 4],
            rows: ["Row 1", "Row 2"]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const q = survey.getQuestionByName("q") as QuestionMatrixDropdownModel;
  var column = q.columns[0];
  expect(column.templateQuestion.rateValues.length).toLooseEqual(5);
  expect(column.templateQuestion.autoGenerate).toLooseEqual(false);
  //expect(column.autoGenerate).toBeFalsy();
});

test("show only 10 items when switching to smileys mode", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  var changed = false;
  q1.onPropertyChanged.add(function (sender, options) {
    if (options.name == "rateValues") changed = true;
  });

  q1.rateCount = 20;
  q1.autoGenerate = false;
  changed = false;
  q1.rateType = "smileys";
  expect(changed).toBeTruthy();

  expect(q1.rateValues.length).toLooseEqual(10);

});

test("rating items custom component", () => {
  var json = {
    elements: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.itemComponent).toLooseEqual("sv-rating-item");

  q1.renderAs = "dropdown";
  expect(q1.itemComponent).toLooseEqual("sv-rating-dropdown-item");

  var json2 = {
    elements: [
      {
        type: "rating",
        name: "q1",
        itemComponent: "custom-item"
      },
    ],
  };
  const survey2 = new SurveyModel(json2);
  const q2 = <QuestionRatingModel>survey2.getQuestionByName("q1");
  expect(q2.itemComponent).toLooseEqual("custom-item");
});
test("displayMode and copying in design-time", () => {
  const json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        displayMode: "dropdown"
      },
    ],
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.renderAs, "q1.renderAs, #1").toLooseEqual("default");
  const q2 = new QuestionRatingModel("q1");
  q2.displayMode = "dropdown";
  expect(q2.renderAs, "q2.renderAs, #2").toLooseEqual("dropdown");
  survey.pages[0].addElement(q2);
  expect(q2.renderAs, "q2.renderAs, #3").toLooseEqual("default");
});
test("renderAs in design-time", () => {
  const json = {
    elements: [
      {
        type: "rating",
        name: "q1",
        renderAs: "dropdown"
      },
    ],
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.displayMode, "q1.renderAs").toLooseEqual("dropdown");
  expect(q1.renderAs, "q1.renderAs").toLooseEqual("default");
});
test("renderAs in runtime", () => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "rating",
        name: "q1",
        renderAs: "dropdown"
      },
    ],
  });
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.renderAs).toLooseEqual("dropdown");
});

test("Generate empty rating", () => {
  const q1 = new QuestionRatingModel("q1");
  expect(q1.toJSON()).toEqualValues({ name: "q1" });
  q1.rateType = "stars";
  expect(q1.toJSON()).toEqualValues({ name: "q1", rateType: "stars" });
  q1.rateType = "stars";
});
test("Generate empty rating in column", () => {
  const q1 = new QuestionMatrixDropdownModel("q1");
  const col1: any = q1.addColumn("col1");
  col1.cellType = "rating";
  const col2: any = q1.addColumn("col2");
  col2.cellType = "rating";
  col2.rateType = "stars";
  expect(q1.toJSON()).toEqualValues({ name: "q1",
    columns: [
      { name: "col1", cellType: "rating" },
      { name: "col2", cellType: "rating", rateType: "stars" }
    ] });
  expect(col1.itemComponent).toLooseEqual("sv-rating-item");
  expect(col2.itemComponent).toLooseEqual("sv-rating-item-star");
});
test("supportAutoAdvance", () => {
  const q1 = new QuestionRatingModel("q1");
  q1.value = 1;
  expect(q1.supportAutoAdvance(), "#1").toLooseEqual(false);
  q1.onMouseDown();
  expect(q1.supportAutoAdvance(), "#2").toLooseEqual(true);
  q1.value = 2;
  expect(q1.supportAutoAdvance(), "#3").toLooseEqual(false);
  q1.displayMode = "dropdown";
  expect(q1.supportAutoAdvance(), "#4").toLooseEqual(true);
});
test("Check hasMin/MaxRateDescription properties on loading", () => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "rating",
        name: "q1",
        minRateDescription: "val1", maxRateDescription: "val2"
      },
    ],
  });
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  expect(q1.hasMinRateDescription, "hasMinRateDescription").toLooseEqual(true);
  expect(q1.hasMaxRateDescription, "hasMaxRateDescription").toLooseEqual(true);
});
test("Check dropdoun rating close on blur, #8862", () => {
  const survey = new SurveyModel({
    elements: [{
      "type": "rating",
      "name": "question1",
      "displayMode": "dropdown"
    }]
  });
  const question = <QuestionRatingModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  const popup: PopupModel = dropdownListModel.popupModel;
  popup.isVisible = true;
  expect(popup.isVisible).toBeTruthy();
  question.onBlur({ target: null, stopPropagation: () => { } });
  expect(popup.isVisible).toBeFalsy();
});

test("Check dropdown rating text, #8953", () => {
  const survey = new SurveyModel({
    elements: [{
      "type": "rating",
      "name": "question1",
      "rateValues": [
        { "value": "Value0", "text": "Label0" },
        { "value": "Value1", "text": "Label1" }
      ]
    }]
  });
  const question = <QuestionRatingModel>survey.getAllQuestions()[0];
  expect(question.visibleChoices.map(c => c.text)).toEqualValues(["Label0", "Label1"]);
});
test("Ranking: items visibleIf and value, Bug#5959", () => {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2] },
      {
        type: "rating",
        name: "q2",
        rateValues: [
          { value: "a", visibleIf: "{q1} contains 1" },
          { value: "b", visibleIf: "{q1} contains 1" },
          { value: "c", visibleIf: "{q1} contains 2" },
          { value: "d", visibleIf: "{q1} contains 2" },
          { value: "e", visibleIf: "{q1} contains 1" },
        ]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = <QuestionRatingModel>survey.getQuestionByName("q2");
  expect(q2.visibleRateValues.length, "visibleRateValues #1").toLooseEqual(0);
  expect(q2.visibleChoices.length, "renderedRateItems #1").toLooseEqual(0);
  q1.value = [1];
  expect(q2.visibleRateValues.length, "visibleRateValues #2").toLooseEqual(3);
  expect(q2.visibleChoices.length, "renderedRateItems #2").toLooseEqual(3);
  q1.value = [2];
  expect(q2.visibleRateValues.length, "visibleRateValues #3").toLooseEqual(2);
  expect(q2.visibleChoices.length, "renderedRateItems #3").toLooseEqual(2);
  q1.value = [1, 2];
  expect(q2.visibleRateValues.length, "visibleRateValues #4").toLooseEqual(5);
  expect(q2.visibleChoices.length, "renderedRateItems #4").toLooseEqual(5);
  q1.value = [];
  expect(q2.visibleRateValues.length, "visibleRateValues #5").toLooseEqual(0);
  expect(q2.visibleChoices.length, "renderedRateItems #5 ").toLooseEqual(0);
  survey.showInvisibleElements = true;
  expect(q2.visibleChoices.length, "renderedRateItems #6").toLooseEqual(5);
  survey.showInvisibleElements = false;
  expect(q2.visibleChoices.length, "renderedRateItems #7").toLooseEqual(0);
  q1.value = [1];
  expect(q2.visibleChoices.length, "renderedRateItems #8").toLooseEqual(3);
  q2.value = "b";
  expect(q2.value, "value set correctly, #8").toEqualValues("b");
  q1.value = [2];
  expect(q2.visibleChoices.length, "renderedRateItems #9").toLooseEqual(2);
  expect(q2.isEmpty(), "value is reset, #9").toEqualValues(true);
});

test("Rating: check in matrix mode", () => {
  const survey = new SurveyModel(
    {
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "rating",
              cellType: "rating",
              rateCount: 10,
              rateMax: 10,
              displayMode: "buttons"
            },
          ],
          rows: ["Row 1", "Row 2", "Row 3"],
        },
      ],
    },
  );
  survey.css = {
    rating: {
      rootWrappable: "wrappble_test"
    }
  };
  const matrix = survey.getAllQuestions()[0];
  const rating = <QuestionRatingModel>matrix.getNestedQuestions()[0];
  expect(rating.ratingRootCss.includes("wrappble_test")).toBeTruthy();
  rating.displayMode = "dropdown";
  expect(rating.ratingRootCss.includes("wrappble_test")).toBeFalsy();
  rating.displayMode = "buttons";
  expect(rating.ratingRootCss.includes("wrappble_test")).toBeTruthy();
});

test("Rating: minRateDescription and maxRateDescription labels do not appear for rateValues", () => {
  const json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "autoGenerate": false,
        "minRateDescription": "Strongly Disagree",
        "maxRateDescription": "Strongly Agree",
        "displayMode": "dropdown",
        "displayRateDescriptionsAsExtremeItems": true,
        "rateValues": [
          { "value": "A", "text": "1" },
          { "value": "B", "text": "2" },
          { "value": "C", "text": "3" },
          { "value": "D", "text": "4" },
          { "value": "E", "text": "5" }
        ],
      }
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  expect(q1.visibleChoices.length, "There are 5 visibleChoices").toLooseEqual(5);
  expect(q1.rateValues.length, "There are 5 rateValues").toLooseEqual(5);
  expect(q1.autoGenerate, "autoGenerate is false").toLooseEqual(false);

  expect(q1.visibleChoices[0].value, "Check first item value").toLooseEqual("A");
  expect(q1.visibleChoices[0].text, "In dropdown mode, text should be the original rateValue text").toLooseEqual("1");
  expect(q1.visibleChoices[0].description.text, "description should be minRateDescription").toLooseEqual("Strongly Disagree");

  expect(q1.visibleChoices[4].value).toLooseEqual("E");
  expect(q1.visibleChoices[4].text, "In dropdown mode, text should be the original rateValue text").toLooseEqual("5");
  expect(q1.visibleChoices[4].description.text, "description should be maxRateDescription").toLooseEqual("Strongly Agree");
});

test("check smileys styles after validate", () => {

  const survey = new SurveyModel({
    elements: [
      {
        type: "rating",
        name: "q1",
        rateType: "smileys",
        isRequired: true
      },
      {
        type: "rating",
        name: "q2",
        rateType: "smileys",
        scaleColorMode: "colored",
        isRequired: true
      }
    ]
  });

  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const q2 = <QuestionRatingModel>survey.getQuestionByName("q2");

  expect(q1.visibleRateValues[0].className.includes("sd-rating__item-smiley--error"), "q1 item className must not include class 'sd-rating__item-smiley--error' before validate").toBeFalsy();
  expect(q2.visibleRateValues[0].className.includes("sd-rating__item-smiley--error"), "q2 item className must not include class 'sd-rating__item-smiley--error' before validate").toBeFalsy();
  survey.validate();
  expect(q1.hasErrors(), "q1 has errors after validate").toLooseEqual(true);
  expect(q1.visibleRateValues[0].className.includes("sd-rating__item-smiley--error"), "q1 item className must include class 'sd-rating__item-smiley--error' after validate").toBeTruthy();
  expect(q2.visibleRateValues[0].className.includes("sd-rating__item-smiley--error"), "q2 item className must include class 'sd-rating__item-smiley--error' after validate").toBeTruthy();
});

test("preview className test", () => {

  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "defaultValue": {
          "Row 1": {
            "Column 1": 3,
            "Column 2": 2
          }
        },
        "readOnly": true,
        "columns": [
          {
            "name": "Column 1",
            "cellType": "rating",
            "rateType": "smileys"
          },
          {
            "name": "Column 2",
            "cellType": "rating",
            "rateType": "stars"
          }
        ],
        "cellType": "rating",
        "rows": ["Row 1"]
      }
    ]
  });

  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

  expect(matrix.visibleRows[0].cells[0].question.visibleRateValues[0].className.includes("sd-rating__item-smiley--preview"), "smileys before preview").toBeFalsy();
  expect(matrix.visibleRows[0].cells[1].question.visibleRateValues[0].className.includes("sd-rating__item-star--preview"), "stars before preview").toBeFalsy();

  survey.showPreview();
  expect(matrix.visibleRows[0].cells[0].question.visibleRateValues[0].className.includes("sd-rating__item-smiley--preview"), "smileys after preview").toBeTruthy();
  expect(matrix.visibleRows[0].cells[1].question.visibleRateValues[0].className.includes("sd-rating__item-star--preview"), "stars after preview").toBeTruthy();
});
test("Test rateItem class on changing value, Bug#10737", () => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "rating",
        name: "q1"
      }
    ]
  });

  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const item1 = q1.visibleRateValues[0];
  const item2 = q1.visibleRateValues[1];
  const containsSelected = (item: RatingItem) => item.className.indexOf("item--selected") > -1;
  expect(containsSelected(item1), "item1 className initial").toLooseEqual(false);
  expect(containsSelected(item2), "item2 className initial").toLooseEqual(false);
  q1.value = 1;
  expect(containsSelected(item1), "item1 className after select").toLooseEqual(true);
  expect(containsSelected(item2), "item2 className after select").toLooseEqual(false);
  q1.value = 2;
  expect(containsSelected(item1), "item1 className after change select").toLooseEqual(false);
  expect(containsSelected(item2), "item2 className after change select").toLooseEqual(true);
});
