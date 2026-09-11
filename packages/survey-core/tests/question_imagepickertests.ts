import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { settings } from "../src/settings";
import { SurveyModel } from "../src/survey";

import { afterEach, beforeEach, describe, test, expect, vi } from "vitest";
test("Items number in run-time and design-time", () => {

  const json = {
    elements: [
      { type: "imagepicker", name: "q", choices: ["a", "b", "c"] }
    ]
  };
  const survey1 = new SurveyModel(json);
  const q1 = <QuestionImagePickerModel>survey1.getQuestionByName("q");
  const survey2 = new SurveyModel();
  survey2.setDesignMode(true);
  survey2.fromJSON(json);
  const q2 = <QuestionImagePickerModel>survey2.getQuestionByName("q");
  expect(q1.visibleChoices.length, "There are 3 items in run-time").toBe(3);
  expect(q2.visibleChoices.length, "There are 4 items in design-time").toBe(4);
});

test("ImagePicker itemFlowDirection should be row by default", () => {
  const json = {
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "imagepicker",
            "name": "question1",
            "colCount": 2,
            "choices": [
              {
                "value": "Image 1",
                "imageLink": "#1"
              },
              {
                "value": "Image 2",
                "imageLink": "#2"
              },
              {
                "value": "Image 3",
                "imageLink": "#3"
              },
              {
                "value": "Image 4",
                "imageLink": "#4"
              }
            ]
          }
        ]
      }
    ]
  };
  function getValuesInColumns(question: QuestionImagePickerModel) {
    return question.columns.map((column) => column.map((choice) => choice.id));
  }
  const survey1 = new SurveyModel(json);
  const q = <QuestionImagePickerModel>survey1.getAllQuestions()[0];
  expect(getValuesInColumns(q)).toEqual([["Image 1", "Image 3"], ["Image 2", "Image 4"]]);
});

function createKeyboardEvent(key: string): any {
  return {
    key: key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  };
}
function createImagePicker(json?: any): QuestionImagePickerModel {
  const survey = new SurveyModel({
    elements: [Object.assign({
      type: "imagepicker",
      name: "q1",
      choices: [
        { value: "lion", imageLink: "#lion" },
        { value: "giraffe", imageLink: "#giraffe" },
        { value: "panda", imageLink: "#panda" }
      ]
    }, json || {})]
  });
  return <QuestionImagePickerModel>survey.getQuestionByName("q1");
}

test("Imagepicker: arrow keys select an item when settings.itemsKeyboard.selectionFollowsFocus is enabled", () => {
  const q1 = createImagePicker();
  expect(q1.isKeyboardNavigationEnabled).toBe(false);
  expect(q1.getItemTabIndex(q1.visibleChoices[0])).toBe(undefined);

  const event = createKeyboardEvent("ArrowRight");
  q1.onItemKeyDown(q1.visibleChoices[0], event);
  expect(event.preventDefault).toHaveBeenCalledTimes(0);
  expect(q1.focusedItemIndex).toBe(-1);
});

describe("Imagepicker: arrow keys move focus without selecting an item", () => {
  beforeEach(() => {
    settings.itemsKeyboard.selectionFollowsFocus = false;
  });
  afterEach(() => {
    settings.itemsKeyboard.selectionFollowsFocus = true;
  });

  test("The group has a single tab stop", () => {
    const q1 = createImagePicker();
    expect(q1.isKeyboardNavigationEnabled).toBe(true);
    expect(q1.getItemTabIndex(q1.visibleChoices[0])).toBe(0);
    expect(q1.getItemTabIndex(q1.visibleChoices[1])).toBe(-1);

    q1.value = "panda";
    expect(q1.getItemTabIndex(q1.visibleChoices[0])).toBe(-1);
    expect(q1.getItemTabIndex(q1.visibleChoices[2])).toBe(0);

    q1.onItemFocusIn(q1.visibleChoices[1]);
    expect(q1.getItemTabIndex(q1.visibleChoices[2])).toBe(-1);
    expect(q1.getItemTabIndex(q1.visibleChoices[1])).toBe(0);
  });
  test("An arrow key moves focus and keeps the value", () => {
    const q1 = createImagePicker();
    const event = createKeyboardEvent("ArrowRight");
    q1.onItemKeyDown(q1.visibleChoices[0], event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(q1.focusedItemIndex).toBe(1);
    expect(q1.isEmpty()).toBe(true);

    q1.onItemKeyDown(q1.visibleChoices[1], createKeyboardEvent("ArrowDown"));
    expect(q1.focusedItemIndex).toBe(2);
    q1.onItemKeyDown(q1.visibleChoices[2], createKeyboardEvent("ArrowLeft"));
    expect(q1.focusedItemIndex).toBe(1);
    expect(q1.isEmpty()).toBe(true);
  });
  test("The Space and Enter keys select the focused item", () => {
    const q1 = createImagePicker();
    q1.onItemKeyDown(q1.visibleChoices[0], createKeyboardEvent("ArrowRight"));
    expect(q1.isEmpty()).toBe(true);
    q1.onItemKeyDown(q1.visibleChoices[1], createKeyboardEvent(" "));
    expect(q1.value).toBe("giraffe");
    q1.onItemKeyDown(q1.visibleChoices[2], createKeyboardEvent("Enter"));
    expect(q1.value).toBe("panda");
  });
  test("A read-only question ignores the Space key", () => {
    const q1 = createImagePicker();
    q1.readOnly = true;
    q1.onItemKeyDown(q1.visibleChoices[1], createKeyboardEvent(" "));
    expect(q1.isEmpty()).toBe(true);
  });
  test("Keyboard navigation is disabled in the multi-select mode", () => {
    const q1 = createImagePicker({ multiSelect: true });
    expect(q1.isKeyboardNavigationEnabled).toBe(false);
    expect(q1.getItemTabIndex(q1.visibleChoices[0])).toBe(undefined);
  });
  test("keyboardItems follows the column DOM order", () => {
    const q1 = createImagePicker({
      colCount: 2,
      choices: [
        { value: "a", imageLink: "#a" },
        { value: "b", imageLink: "#b" },
        { value: "c", imageLink: "#c" },
        { value: "d", imageLink: "#d" },
        { value: "e", imageLink: "#e" }
      ]
    });
    expect(q1.keyboardItems.map(item => item.value)).toEqual(["a", "c", "e", "b", "d"]);
  });
  test("An item without an image is skipped", () => {
    const q1 = createImagePicker({
      choices: [
        { value: "lion", imageLink: "#lion" },
        { value: "broken" },
        { value: "panda", imageLink: "#panda" }
      ]
    });
    q1.onItemKeyDown(q1.visibleChoices[0], createKeyboardEvent("ArrowRight"));
    expect(q1.focusedItemIndex).toBe(2);
    expect(q1.keyboardItems[q1.focusedItemIndex].value).toBe("panda");
  });
});