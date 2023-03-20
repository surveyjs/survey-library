import { QuestionRatingModel } from "../src/question_rating";
import { SurveyModel } from "../src/survey";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";
import { CustomResizeObserver } from "./questionImagepicker";
import { RendererFactory } from "../src/rendererFactory";
import { DropdownListModel } from "../src/dropdownListModel";
import { ListModel } from "../src/list";

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
  survey.css = defaultV2Css;
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.afterRender(rootElement);
  assert.ok(q1["resizeObserver"]);
  q1.dispose();
  assert.notOk(q1["resizeObserver"]);
});

QUnit.test("check rating resize observer behavior", (assert) => {
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
  survey.css = defaultV2Css;
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
  survey.css = defaultV2Css;
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
  assert.equal(q1.visibleRateValues.length, 4);
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
  var oldRendered = q1.renderedRateValues;
  q1.visibleRateValues[0].text = "abc";
  assert.equal(q1.rateValues.length, 5);
  assert.equal(q1.renderedRateValues, oldRendered, "renderedRateValues is not cloned");
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
  q1.cssClasses;
  assert.ok(dropdownListModel.popupModel.cssClass.includes("custom-popup-class"));
  assert.equal(list.cssClasses.item, "original-class custom-class");
  assert.equal(list.cssClasses.itemSelected, "original-class-selected custom-class-selected");
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
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "";
  q1.cssClasses.itemStarDisabled = "";
  q1.value = 2;
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.onItemMouseIn(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_high");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_high");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.onItemMouseOut(q1.renderedRateItems[3]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.value = 4;
  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_unhigh");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_unhigh");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  q1.onItemMouseOut(q1.renderedRateItems[1]);
  survey.mode = "display";
  q1.onItemMouseIn(q1.renderedRateItems[1]);
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");
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
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "sv_q_selected";
  q1.cssClasses.itemStarDisabled = "sv_q_disabled";
  q1.value = 2;
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "");

  survey.mode = "display";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_disabled");
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
  const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
  q1.cssClasses.itemStar = "";
  q1.cssClasses.itemStarHighlighted = "sv_q_high";
  q1.cssClasses.itemStarUnhighlighted = "sv_q_unhigh";
  q1.cssClasses.itemStarSelected = "sv_q_selected";
  q1.cssClasses.itemStarDisabled = "sv_q_disabled";
  q1.value = "a_little_bit";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "", "item[2] is empty");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "", "item[3] is empty");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "", "item[4] is empty");

  survey.mode = "display";
  assert.equal(q1.getItemClass(q1.renderedRateItems[0].itemValue), "sv_q_selected sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[1].itemValue), "sv_q_selected sv_q_disabled");
  assert.equal(q1.getItemClass(q1.renderedRateItems[2].itemValue), "sv_q_disabled", "item[2] is disabled not selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[3].itemValue), "sv_q_disabled", "item[3] is disabled not selected");
  assert.equal(q1.getItemClass(q1.renderedRateItems[4].itemValue), "sv_q_disabled", "item[4] is disabled not selected");
});
