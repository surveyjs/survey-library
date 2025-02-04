import { QuestionRatingModel } from "../src/question_rating";
import { SurveyModel } from "../src/survey";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { CustomResizeObserver } from "./questionImagepicker";
import { RendererFactory } from "../src/rendererFactory";
import { DropdownListModel } from "../src/dropdownListModel";
import { ListModel } from "../src/list";
import { ItemValue } from "../src/itemvalue";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { settings } from "../src/settings";
import { _setIsTouch } from "../src/utils/devices";
import { PopupModel } from "../src/popup";
import { setOldTheme } from "./oldTheme";

QUnit.test("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1);
});

QUnit.test("check rating default items has owner and owner property name", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  const item = q1.visibleRateValues[0];
  assert.equal(item.locOwner, q1);
  assert.equal(item.ownerPropertyName, "rateValues");
});
QUnit.test("check rating processResponsiveness", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1["processResponsiveness"](500, 600);
  assert.equal(q1.renderAs, "default");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "dropdown");
});

QUnit.test("check rating initResponsiveness", (assert) => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  var json = {
    questions: [
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
  assert.ok(q1["resizeObserver"]);
  q1.dispose();
  assert.notOk(q1["resizeObserver"]);

  contentElement.remove();
  rootElement.remove();
});

QUnit.test("check rating resize observer behavior", (assert) => {
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
    questions: [
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
  assert.ok(q1["resizeObserver"]);
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 300;
  currentScrollWidth = 300;
  (<any>q1["resizeObserver"]).call();
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "dropdown");
  currentOffsetWidth = 400;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "default");
  currentOffsetWidth = 200;
  (<any>q1["resizeObserver"]).call();
  (<any>q1["resizeObserver"]).call(); //double process to reset isProcessed flag
  assert.equal(q1.renderAs, "dropdown");
  q1["destroyResizeObserver"]();
  assert.equal(q1.renderAs, "default", "https://github.com/surveyjs/survey-creator/issues/2966: after destroying resize observer renderAs should return to default state");
  window.getComputedStyle = getComputedStyle;
  window.ResizeObserver = ResizeObserver;

  contentElement.remove();
  rootElement.remove();
});

QUnit.test("check rating in case of state 'collapsed'", (assert) => {
  const rootElement = document.createElement("div");
  const contentElement = document.createElement("div");
  contentElement.className = "sd-scrollable-container";
  rootElement.append(contentElement);
  const getFuncOnStateChanged = () => {
    return q1["onPropChangeFunctions"].filter(item => item.name == "state" && item.key == "for-responsiveness")[0];
  };
  var json = {
    questions: [
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
  assert.notOk(q1["resizeObserver"]);
  assert.ok(getFuncOnStateChanged());
  q1.state = "expanded";
  assert.ok(q1["resizeObserver"]);
  assert.notOk(getFuncOnStateChanged());
  q1.dispose();
  assert.notOk(q1["resizeObserver"]);
});
QUnit.test("check rating displayMode", (assert) => {
  var json = {
    questions: [
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
  assert.equal(q1.renderAs, "default", "displayMode=buttons, big size, default");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "default", "displayMode=buttons, small size, default");

  q1.displayMode = "dropdown";
  q1["processResponsiveness"](500, 600);
  assert.equal(q1.renderAs, "dropdown", "displayMode=dropdown, big size, dropdown");
  q1["processResponsiveness"](600, 500);
  assert.equal(q1.renderAs, "dropdown", "displayMode=dropdown, big size, dropdown");
});
QUnit.test("do not process reponsiveness when required width differs from avalailable less then 2px: #4554", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1["processResponsiveness"](502, 500), false);
  assert.equal(q1.renderAs, "default", "difference too small: not processed");
  assert.equal(q1["processResponsiveness"](503, 500), true);
  assert.equal(q1.renderAs, "dropdown", "difference is enough: is processed");
  q1["processResponsiveness"](503, 500); // dummy: to reset isProcessed flag
  assert.equal(q1["processResponsiveness"](500, 502), false);
  assert.equal(q1.renderAs, "dropdown", "difference too small: not processed");
  assert.equal(q1["processResponsiveness"](500, 503), true);
  assert.equal(q1.renderAs, "default", "difference is enough: processed");
});
QUnit.test("Do not process responsiveness if displayMode: 'dropdown' and set renderAs 'dropdown'", (assert) => {
  RendererFactory.Instance.registerRenderer("rating", "dropdown", "test-renderer");
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
        displayMode: "dropdown"
      },
    ],
  };
  let survey = new SurveyModel(json);
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.renderAs, "dropdown");
  assert.equal(q1.isDefaultRendering(), false);
  const container = document.createElement("div");
  container.innerHTML = "<div class='sd-scrollable-container'></div>";
  q1["initResponsiveness"](container);
  assert.equal(q1["resizeObserver"], undefined);

  survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.setJsonObject(json);
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.renderAs, "default");
  assert.equal(q1.isDefaultRendering(), true);
  RendererFactory.Instance.unregisterRenderer("rating", "dropdown");

  container.remove();
});
QUnit.test("check getItemClass in display mode", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  survey.mode = "display";
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_rating_hover";
  const item = q1.visibleRateValues[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_rating_hover") == -1);
});
QUnit.test("Check numeric item values recalculation", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.visibleRateValues.length, 5);
  q1.rateMax = 6;
  assert.equal(q1.visibleRateValues.length, 6);
  q1.rateStep = 2;
  assert.equal(q1.visibleRateValues.length, 3);
  q1.rateMin = 0;
  assert.equal(q1.visibleRateValues.length, 3);
});

QUnit.test("Check rateValues on text change", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateValues.length, 0);
  let oldRendered = q1.renderedRateItems;
  q1.visibleRateValues[0].text = "abc";
  assert.equal(q1.rateValues.length, 5);
  assert.strictEqual(q1.renderedRateItems, oldRendered, "renderedRateItems is cloned");
  oldRendered = q1.renderedRateItems;
  q1.visibleRateValues[1].text = "abc";
  assert.strictEqual(q1.renderedRateItems, oldRendered, "renderedRateItems is not cloned");
});
QUnit.test("Check cssClasses update when dropdownListModel is set", (assert) => {
  var json = {
    questions: [
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
  assert.ok(dropdownListModel.popupModel.cssClass.includes("custom-popup-class"));
  assert.equal(list.cssClasses.item, "original-class custom-class");
  assert.equal(list.cssClasses.itemSelected, "original-class-selected custom-class-selected");
});
QUnit.test("Check dropdownListModel isItemSelected works correctly", (assert) => {
  var json = {
    questions: [
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

  assert.notOk(list.isItemSelected(list.actions[0]));
  assert.notOk(list.isItemSelected(list.actions[1]));

  question.value = 1;

  assert.ok(list.isItemSelected(list.actions[0]));
  assert.notOk(list.isItemSelected(list.actions[1]));

  question.value = 2;

  assert.notOk(list.isItemSelected(list.actions[0]));
  assert.ok(list.isItemSelected(list.actions[1]));

});
QUnit.test("check stars highlighting", (assert) => {
  var json = {
    questions: [
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
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "", "value=2 index=0");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "", "value=2 index=1");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "", "value=2 index=2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "", "value=2 index=3");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "value=2 index=4");

  q1.onItemMouseIn(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "", "mouseIn #1 index=0");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "", "mouseIn #1 index=1");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_high", "mouseIn #1 index=2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_high", "mouseIn #1 index=3");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "mouseIn #1 index=4");

  q1.onItemMouseOut(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "", "onItemMouseOut #1 index=0");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "", "onItemMouseOut #1 index=1");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "", "onItemMouseOut #1 index=2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "", "onItemMouseOut #1 index=3");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "onItemMouseOut #1 index=4");

  q1.value = 4;
  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "", "mouseIn #2 index=0");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "", "mouseIn #2 index=1");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_unhigh", "mouseIn #2 index=2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_unhigh", "mouseIn #2 index=3");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "mouseIn #2 index=4");

  q1.onItemMouseOut(q1.renderedRateItems[1]);
  survey.mode = "display";
  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "", "survey.mode=display index=0");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "", "survey.mode=display index=1");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "", "survey.mode=display index=2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "", "survey.mode=display index=3");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "survey.mode=display index=4");
});

QUnit.test("check stars highlighting design mode", (assert) => {
  var json = {
    questions: [
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

  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.onItemMouseIn(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");
});

QUnit.test("check stars highlighting on touch device", (assert) => {
  var json = {
    questions: [
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

  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.onItemMouseIn(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");
  _setIsTouch(false);
});

QUnit.test("check stars styles", (assert) => {
  var json = {
    questions: [
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
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  survey.mode = "display";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_readonly");
});

QUnit.test("check smiley styles", (assert) => {

  var json = {
    questions: [
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
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_sc");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_sc sv_q_rc");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_sc");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_sc");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_sc");

  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "scale";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_rc");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "default";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");
});

QUnit.test("check stars for rateValues", (assert) => {
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
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "", "item[2] is empty");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "", "item[3] is empty");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "item[4] is empty");

  survey.mode = "display";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_readonly", "item[2] is disabled not selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_readonly", "item[3] is disabled not selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_readonly", "item[4] is disabled not selected");
});

QUnit.test("check smileys for rateValues", (assert) => {
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
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[0].itemValue), "not-good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[1].itemValue), "average");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[2].itemValue), "normal");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[3].itemValue), "good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[4].itemValue), "very-good");
});

QUnit.test("check smileys for min/max", (assert) => {
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
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[0].itemValue), "not-good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[1].itemValue), "very-good");

  q1.rateMin = 0;
  q1.rateMax = 2;
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[0].itemValue), "not-good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[1].itemValue), "normal");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[2].itemValue), "very-good");

  q1.rateMin = 1;
  q1.rateMax = 5;
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[0].itemValue), "not-good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[1].itemValue), "average");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[2].itemValue), "normal");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[3].itemValue), "good");
  assert.equal(q1.getItemSmiley(q1.renderedRateItems[4].itemValue), "very-good");
});

QUnit.test("check smileys styles", (assert) => {

  var json = {
    questions: [
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
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_allowhover");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_allowhover");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_allowhover");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_allowhover");

  survey.mode = "display";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_readonly");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_readonly");
});

QUnit.test("rating smileys max item count", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        rateType: "smileys",
        name: "q1",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  assert.equal(q1.renderedRateItems.length, 5);
  q1.rateMax = 10;
  assert.equal(q1.renderedRateItems.length, 10);
  q1.rateMax = 15;
  assert.equal(q1.renderedRateItems.length, 10);

  q1.rateType = "labels";
  assert.equal(q1.renderedRateItems.length, 15);
  q1.renderedRateItems[0].itemValue.value = "a";

  q1.rateType = "smileys";
  assert.equal(q1.renderedRateItems.length, 10);
});

QUnit.test("check fixed width styles", (assert) => {

  var json = {
    questions: [
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

  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_item sv_q_item-fixed");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_item sv_q_item-fixed");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_item sv_q_item-fixed");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_item");
});

QUnit.test("check fixed width styles - rate values", (assert) => {

  var json = {
    questions: [
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

  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_item sv_q_item-fixed");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_item");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_item sv_q_item-fixed");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_item");
});

QUnit.test("rateCount changing rateMin/rateMax", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.rateMax, 5);

  q1.rateCount = 6;
  assert.equal(q1.rateMax, 6);
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.visibleRateValues.length, 6);
});

QUnit.test("rateMin/rateMax/rateStep changing rateCount", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.rateMax, 5);
  assert.equal(q1.rateCount, 5);

  q1.rateMax = 6;
  assert.equal(q1.rateMax, 6, "rateMax #1");
  assert.equal(q1.rateMin, 1, "rateMin #1");
  assert.equal(q1.visibleRateValues.length, 6, "length #1");
  assert.equal(q1.rateCount, 6, "count #1");

  q1.rateMin = 2;
  assert.equal(q1.rateMax, 6, "rateMax #2");
  assert.equal(q1.rateMin, 2, "rateMin #2");
  assert.equal(q1.visibleRateValues.length, 5, "length #2");
  assert.equal(q1.rateCount, 5, "length #2");

  q1.rateStep = 3;
  assert.equal(q1.rateMax, 5, "rateMax #3");
  assert.equal(q1.rateMin, 2, "rateMin #3");
  assert.equal(q1.visibleRateValues.length, 2, "length #3");
  assert.equal(q1.rateCount, 2, "length #2");
});

QUnit.test("rateStep changing rateMax", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.rateMax, 5);
  assert.equal(q1.rateCount, 5);

  q1.rateMax = 6;
  assert.equal(q1.rateMax, 6);
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.visibleRateValues.length, 6);
  assert.equal(q1.rateCount, 6);

  q1.rateStep = 2;
  assert.equal(q1.rateMax, 5);
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.visibleRateValues.length, 3);
  assert.equal(q1.rateCount, 3);
});

QUnit.test("rateValues changing rateCount", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateCount, 3);

  q1.rateValues.push(new ItemValue("d"));
  assert.equal(q1.rateCount, 4);
});

QUnit.test("rateCount changing rateValues", (assert) => {
  var json = {
    questions: [
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
  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b"]);

  q1.rateCount = 4;
  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b", "item3", "item4"]);
});

QUnit.test("rateMin/rateMax/rateStep does not change rateValues and rateCount", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1",
        rateValues: ["a", "b", "c"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");

  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b", "c"]);
  assert.equal(q1.rateCount, 3);

  q1.rateMax = 100;
  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b", "c"]);
  assert.equal(q1.rateCount, 3);

  q1.rateMin = 50;
  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b", "c"]);
  assert.equal(q1.rateCount, 3);

  q1.rateStep = 3;
  assert.deepEqual(q1.rateValues.map(i => i.value), ["a", "b", "c"]);
  assert.equal(q1.rateCount, 3);
});

QUnit.test("rate params loading from json", (assert) => {
  const survey = new SurveyModel();

  survey.setJsonObject({
    questions: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMin: 2
      },
    ],
  });
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateCount, 6, "rateCount, rateMin -> rateCount");
  assert.equal(q1.rateMin, 2, "rateCount, rateMin -> rateMin");
  assert.equal(q1.rateMax, 7, "rateCount, rateMin -> rateMax");

  survey.setJsonObject({
    questions: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMax: 7
      },
    ],
  });
  q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateCount, 6, "rateCount, rateMax -> rateCount");
  assert.equal(q1.rateMin, 2, "rateCount, rateMax -> rateMin");
  assert.equal(q1.rateMax, 7, "rateCount, rateMax -> rateMax");

  survey.setJsonObject({
    questions: [
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
  assert.equal(q1.rateCount, 6, "rateCount, rateMax -> rateCount");
  assert.equal(q1.rateMin, 2, "rateCount, rateMax -> rateMin");
  assert.equal(q1.rateMax, 7, "rateCount, rateMax -> rateMax");

  survey.setJsonObject({
    questions: [
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
  assert.equal(q1.rateCount, 3, "rateCount, rateMax -> rateCount");
  assert.equal(q1.rateMin, 2, "rateCount, rateMax -> rateMin");
  assert.equal(q1.rateMax, 7, "rateCount, rateMax -> rateMax");
});

QUnit.test("autoGenerate change creates rateValues", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateMin, 1);
  assert.equal(q1.rateMax, 5);
  assert.equal(q1.rateValues.length, 0);

  q1.autoGenerate = false;
  assert.equal(q1.rateValues.length, 5);
});

QUnit.test("when autoGenerate true rateValues ignored", (assert) => {
  var json = {
    questions: [
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
  assert.deepEqual(q1.visibleRateValues.map(i => i.value), [1, 2, 3]);
});

QUnit.test("rate autoGenerate loading from json", (assert) => {
  const survey = new SurveyModel();

  survey.setJsonObject({
    questions: [
      {
        type: "rating",
        name: "q1",
        rateCount: 6,
        rateMin: 2
      },
    ],
  });
  let q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.ok(q1.autoGenerate);
  assert.equal(q1.visibleRateValues.length, 6);

  survey.setJsonObject({
    questions: [
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
  assert.notOk(q1.autoGenerate);
  assert.equal(q1.visibleRateValues.length, 3);

  survey.setJsonObject({
    questions: [
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
  assert.ok(q1.autoGenerate);
  assert.equal(q1.visibleRateValues.length, 6);
});

QUnit.test("check icons for rateValues", (assert) => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateDisplayMode": "stars",
        "rateValues": [1, 2]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateDisplayMode = "smileys";
  assert.equal(q1.rateValues[0].icon, "not-good");
  assert.equal(q1.rateValues[1].icon, "very-good");

  q1.rateCount = 3;
  assert.equal(q1.rateValues[0].icon, "not-good");
  assert.equal(q1.rateValues[1].icon, "normal");
  assert.equal(q1.rateValues[2].icon, "very-good");
});

QUnit.test("change rateCount on switch rateDisplayMode", (assert) => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateDisplayMode": "stars",
        "rateValues": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateDisplayMode = "smileys";
  assert.equal(q1.rateCount, 10);
  assert.equal(q1.rateValues.length, 10);
});

QUnit.test("reset rateValues on change autoGenerate", (assert) => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateDisplayMode": "stars",
        "rateValues": [1, 2, 3]
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.rateValues.length, 3);
  q1.autoGenerate = true;
  assert.equal(q1.rateValues.length, 0);
});

QUnit.test("rateCount limitations", (assert) => {
  var json = {
    elements: [
      {
        "type": "rating",
        "name": "q1",
        "rateDisplayMode": "stars"
      }]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.rateCount = 1;
  assert.equal(q1.rateCount, 2);
  q1.rateCount = 21;
  assert.equal(q1.rateCount, 20);
  q1.rateCount = 15;
  assert.equal(q1.rateCount, 15);
  q1.rateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  assert.equal(q1.rateCount, 22);
  q1.rateCount = 21;
  assert.equal(q1.rateCount, 21);

  q1.rateDisplayMode = "smileys";
  q1.rateCount = 15;
  assert.equal(q1.rateCount, 10);
});

QUnit.test("rating colors without css vars", (assert) => {
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
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";

  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), { "--sd-rating-item-color": null });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), { "--sd-rating-item-color": null });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), { "--sd-rating-item-color": null });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), { "--sd-rating-item-color": null });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), { "--sd-rating-item-color": null });
});

QUnit.test("rating colors", (assert) => {
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
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), { "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), { "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), { "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), { "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  q1.readOnly = true;
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), {}, "ro 1");
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), {}, "ro 2");
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), {}, "ro 3");
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), {}, "ro 4");
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), {}, "ro 5");
  q1.readOnly = false;

  survey.showPreview();
  let qp = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.deepEqual(qp.getItemStyle(qp.visibleRateValues[0]), {}, "pv 1");
  assert.deepEqual(qp.getItemStyle(qp.visibleRateValues[1]), {}, "pv 2");
  assert.deepEqual(qp.getItemStyle(qp.visibleRateValues[2]), {}, "pv 3");
  assert.deepEqual(qp.getItemStyle(qp.visibleRateValues[3]), {}, "pv 4");
  assert.deepEqual(qp.getItemStyle(qp.visibleRateValues[4]), {}, "pv 5");
  survey.cancelPreview();

  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1], q1.renderedRateItems[1].highlight), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)", "--sd-rating-item-color-light": "rgba(227, 117, 5, 0.2)" });
  q1.onItemMouseOut(q1.renderedRateItems[1]);

  q1.scaleColorMode = "monochrome";
  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1], q1.renderedRateItems[1].highlight), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  q1.onItemMouseOut(q1.renderedRateItems[1]);

  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), { "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), { "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), { "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), { "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

  q1.scaleColorMode = "monochrome";
  q1.rateColorMode = "default";

  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), {});
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), {});
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), {});
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), {});
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), {});

  q1.value = null;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  q1.isRequired = true;
  q1.validate();
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), {
    "--sd-rating-item-color": "rgba(200, 20, 10, 1)"
  });

  document.documentElement.style.setProperty("--sd-rating-bad-color", null);
  document.documentElement.style.setProperty("--sd-rating-normal-color", null);
  document.documentElement.style.setProperty("--sd-rating-good-color", null);

  document.documentElement.style.setProperty("--sd-rating-bad-color-light", null);
  document.documentElement.style.setProperty("--sd-rating-normal-color-light", null);
  document.documentElement.style.setProperty("--sd-rating-good-color-light", null);
});

QUnit.test("rating colors when vars used", (assert) => {
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
  q1.value = 4;
  q1.scaleColorMode = "colored";
  q1.rateColorMode = "scale";
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), { "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), { "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), { "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), { "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });

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
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[0]), { "--sd-rating-item-color": "rgba(200, 20, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[1]), { "--sd-rating-item-color": "rgba(227, 117, 5, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[2]), { "--sd-rating-item-color": "rgba(255, 215, 0, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[3]), { "--sd-rating-item-color": "rgba(132, 207, 10, 1)" });
  assert.deepEqual(q1.getItemStyle(q1.visibleRateValues[4]), { "--sd-rating-item-color": "rgba(10, 200, 20, 1)" });
});

QUnit.test("check rating in-matrix mode styles", (assert) => {

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

  assert.equal(q1.ratingRootCss, "sv_q sv_q--small");
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item-smiley sv_q_item-smiley--small");

  q.columns[0].rateType = "stars";
  assert.equal(q1.itemStarIcon, "icon-rating-star-small");
  assert.equal(q1.itemStarIconAlt, "icon-rating-star-small-2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item-star sv_q_item-star--small");

  q.columns[0].rateType = "labels";
  assert.equal(q1.ratingRootCss, "sv_q");

  q.columns[0].rateType = "smileys";
  settings.matrix.rateSize = "normal";
  assert.equal(q1.ratingRootCss, "sv_q");
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item-smiley");

  q.columns[0].rateType = "stars";
  assert.equal(q1.itemStarIcon, "icon-rating-star");
  assert.equal(q1.itemStarIconAlt, "icon-rating-star-2");
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_item-star");

  q.columns[0].rateType = "labels";
  assert.equal(q1.ratingRootCss, "sv_q");
  settings.matrix.rateSize = "small";
});

QUnit.test("check rating in-matrix mode styles", (assert) => {

  const survey = new SurveyModel({ questions: [{ type: "rating", name: "q1" }] });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.cssClasses.root = "sv_q";
  q1.cssClasses.rootLabelsTop = "sv_q__top";
  assert.equal(q1.ratingRootCss, "sv_q");
  q1.rateDescriptionLocation = "top";
  assert.equal(q1.ratingRootCss, "sv_q");
  q1.maxRateDescription = "Bad";
  assert.equal(q1.ratingRootCss, "sv_q sv_q__top");
});

QUnit.test("check rating display-mode styles", (assert) => {

  const survey = new SurveyModel({ questions: [{ type: "rating", name: "q1" }] });
  const q1 = survey.getQuestionByName("q1") as QuestionRatingModel;
  q1.cssClasses.root = "sv_q-root";
  q1.cssClasses.rootWrappable = "sv_q-root__wrap";
  assert.equal(q1.ratingRootCss, "sv_q-root");
  q1.displayMode = "buttons";
  assert.equal(q1.ratingRootCss, "sv_q-root sv_q-root__wrap");
});

QUnit.test("check rating triggerResponsiveness method", (assert) => {
  const ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = <any>CustomResizeObserver;
  const done = assert.async();

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

  var json = {
    questions: [
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

  assert.notOk(!!q2["triggerResponsivenessCallback"]);
  assert.ok(!!q1["triggerResponsivenessCallback"]);
  assert.ok(q1["resizeObserver"]);
  assert.equal(q1.renderAs, "default");

  contentElement.style.width = "350px";

  survey.triggerResponsiveness(false);
  assert.equal(q1.renderAs, "dropdown");

  contentElement.style.width = "450px";
  //to reset is processed flag
  survey.triggerResponsiveness(false);

  survey.triggerResponsiveness(false);
  assert.equal(q1.renderAs, "default");

  ratingElement.style.width = "500px";

  survey.triggerResponsiveness(false);
  assert.equal(q1.renderAs, "default");

  survey.triggerResponsiveness(true);

  setTimeout(() => {
    assert.equal(q1.renderAs, "dropdown");

    ratingElement.remove();
    contentElement.remove();
    rootElement.remove();
    window.ResizeObserver = ResizeObserver;
    done();
  }, 1);

});

QUnit.test("check rating in-matrix pre-defined items", (assert) => {
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
  assert.equal(column.templateQuestion.rateValues.length, 5);
  assert.equal(column.templateQuestion.autoGenerate, false);
  //assert.notOk(column.autoGenerate);
});

QUnit.test("show only 10 items when switching to smileys mode", (assert) => {
  var json = {
    questions: [
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
  assert.ok(changed);

  assert.equal(q1.rateValues.length, 10);

});

QUnit.test("rating items custom component", (assert) => {
  var json = {
    questions: [
      {
        type: "rating",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  assert.equal(q1.itemComponent, "sv-rating-item");

  q1.renderAs = "dropdown";
  assert.equal(q1.itemComponent, "sv-rating-dropdown-item");

  var json2 = {
    questions: [
      {
        type: "rating",
        name: "q1",
        itemComponent: "custom-item"
      },
    ],
  };
  const survey2 = new SurveyModel(json2);
  const q2 = <QuestionRatingModel>survey2.getQuestionByName("q1");
  assert.equal(q2.itemComponent, "custom-item");
});
QUnit.test("displayMode and copying in design-time", (assert) => {
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
  assert.equal(q1.renderAs, "default", "q1.renderAs, #1");
  const q2 = new QuestionRatingModel("q1");
  q2.displayMode = "dropdown";
  assert.equal(q2.renderAs, "dropdown", "q2.renderAs, #2");
  survey.pages[0].addElement(q2);
  assert.equal(q2.renderAs, "default", "q2.renderAs, #3");
});
QUnit.test("renderAs in design-time", (assert) => {
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
  assert.equal(q1.displayMode, "dropdown", "q1.renderAs");
  assert.equal(q1.renderAs, "default", "q1.renderAs");
});
QUnit.test("renderAs in runtime", (assert) => {
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
  assert.equal(q1.renderAs, "dropdown");
});

QUnit.test("Generate empty rating", (assert) => {
  const q1 = new QuestionRatingModel("q1");
  assert.deepEqual(q1.toJSON(), { name: "q1" });
  q1.rateType = "stars";
  assert.deepEqual(q1.toJSON(), { name: "q1", rateType: "stars" });
  q1.rateType = "stars";
});
QUnit.test("Generate empty rating in column", (assert) => {
  const q1 = new QuestionMatrixDropdownModel("q1");
  const col1: any = q1.addColumn("col1");
  col1.cellType = "rating";
  const col2: any = q1.addColumn("col2");
  col2.cellType = "rating";
  col2.rateType = "stars";
  assert.deepEqual(q1.toJSON(), { name: "q1",
    columns: [
      { name: "col1", cellType: "rating" },
      { name: "col2", cellType: "rating", rateType: "stars" }
    ] });
  assert.equal(col1.itemComponent, "sv-rating-item");
  assert.equal(col2.itemComponent, "sv-rating-item-star");
});
QUnit.test("supportAutoAdvance", (assert) => {
  const q1 = new QuestionRatingModel("q1");
  q1.value = 1;
  assert.equal(q1.supportAutoAdvance(), false, "#1");
  q1.onMouseDown();
  assert.equal(q1.supportAutoAdvance(), true, "#2");
  q1.value = 2;
  assert.equal(q1.supportAutoAdvance(), false, "#3");
  q1.displayMode = "dropdown";
  assert.equal(q1.supportAutoAdvance(), true, "#4");
});
QUnit.test("Check hasMin/MaxRateDescription properties on loading", (assert) => {
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
  assert.equal(q1.hasMinRateDescription, true, "hasMinRateDescription");
  assert.equal(q1.hasMaxRateDescription, true, "hasMaxRateDescription");
});
QUnit.test("Check dropdoun rating close on blur, #8862", function (assert) {
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
  assert.ok(popup.isVisible);
  question.onBlur({ target: null, stopPropagation: () => { } });
  assert.notOk(popup.isVisible);
});

QUnit.test("Check dropdown rating text, #8953", function (assert) {
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
  assert.deepEqual(question.visibleChoices.map(c => c.text), ["Label0", "Label1"]);
});
QUnit.test("Ranking: items visibleIf and value, Bug#5959", function(assert) {
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
  assert.equal(q2.visibleRateValues.length, 0, "visibleRateValues #1");
  assert.equal(q2.renderedRateItems.length, 0, "renderedRateItems #1");
  q1.value = [1];
  assert.equal(q2.visibleRateValues.length, 3, "visibleRateValues #2");
  assert.equal(q2.renderedRateItems.length, 3, "renderedRateItems #2");
  q1.value = [2];
  assert.equal(q2.visibleRateValues.length, 2, "visibleRateValues #3");
  assert.equal(q2.renderedRateItems.length, 2, "renderedRateItems #3");
  q1.value = [1, 2];
  assert.equal(q2.visibleRateValues.length, 5, "visibleRateValues #4");
  assert.equal(q2.renderedRateItems.length, 5, "renderedRateItems #4");
  q1.value = [];
  assert.equal(q2.visibleRateValues.length, 0, "visibleRateValues #5");
  assert.equal(q2.renderedRateItems.length, 0, "renderedRateItems #5 ");
  survey.showInvisibleElements = true;
  assert.equal(q2.renderedRateItems.length, 5, "renderedRateItems #6");
  survey.showInvisibleElements = false;
  assert.equal(q2.renderedRateItems.length, 0, "renderedRateItems #7");
  q1.value = [1];
  assert.equal(q2.renderedRateItems.length, 3, "renderedRateItems #8");
  q2.value = "b";
  assert.deepEqual(q2.value, "b", "value set correctly, #8");
  q1.value = [2];
  assert.equal(q2.renderedRateItems.length, 2, "renderedRateItems #9");
  assert.deepEqual(q2.isEmpty(), true, "value is reset, #9");
});
