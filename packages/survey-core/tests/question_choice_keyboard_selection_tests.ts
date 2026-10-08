import { SurveyModel } from "../src/survey";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionCheckboxBase } from "../src/question_baseselect";
import { indexToChoiceKeyCode, choiceKeyCodeToIndex } from "../src/utils/choice-key-codes";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { QuestionButtonGroupModel } from "../src/question_buttongroup";
import { QuestionRankingModel } from "../src/question_ranking";
import { Serializer } from "../src/jsonobject";
import { settings } from "../src/settings";
import { SurveyElement } from "../src/survey-element";
import { ItemValue } from "../src/itemvalue";
import { afterEach, expect, test, vi } from "vitest";

const mounted: HTMLElement[] = [];

afterEach(() => {
  vi.useRealTimers();
  mounted.splice(0).forEach((el) => el.remove());
});

function numberedChoices(count: number): Array<string> {
  const res = new Array<string>();
  for (let i = 1; i <= count; i++) res.push("c" + i);
  return res;
}

function createSurvey(type: string, choiceCount: number, questionExtra: any = {}, surveyExtra: any = {}): SurveyModel {
  return new SurveyModel(Object.assign({
    showChoiceShortcutKeys: true,
    elements: [
      Object.assign({
        type: type,
        name: "q",
        choices: numberedChoices(choiceCount)
      }, questionExtra, {
        choices: questionExtra.choices || numberedChoices(choiceCount)
      })
    ]
  }, surveyExtra));
}

function questionOf<T extends QuestionCheckboxBase>(survey: SurveyModel): T {
  return survey.getQuestionByName("q") as T;
}

function inputFor(question: QuestionCheckboxBase, item: ItemValue, type: string): HTMLInputElement {
  const existing = document.body.querySelector("#" + CSS.escape(question.getItemId(item)));
  if (existing) return existing as HTMLInputElement;
  const input = document.createElement("input");
  input.type = type;
  input.id = question.getItemId(item);
  Object.defineProperty(input, "offsetParent", { configurable: true, get: () => document.body });
  document.body.appendChild(input);
  mounted.push(input);
  return input;
}

function imageChoices(count: number): Array<any> {
  const res = new Array<any>();
  for (let i = 1; i <= count; i++) {
    res.push({ value: "c" + i, imageLink: "img" + i });
  }
  return res;
}

function inputTypeFor(question: QuestionCheckboxBase): string {
  if (question.getType() === "checkbox") return "checkbox";
  if (question.getType() === "imagepicker" && (question as QuestionImagePickerModel).multiSelect) return "checkbox";
  return "radio";
}

function press(question: QuestionCheckboxBase, key: string, extra: any = {}): ReturnType<typeof vi.fn> {
  const type = extra.type || inputTypeFor(question);
  const item = extra.item || question.visibleChoices[0];
  const input = extra.target || inputFor(question, item, type);
  const preventDefault = vi.fn();
  const event: any = {
    key: key,
    keyCode: key === "Enter" ? 13 : 0,
    target: input,
    preventDefault: preventDefault,
    ctrlKey: !!extra.ctrlKey,
    altKey: !!extra.altKey,
    metaKey: !!extra.metaKey,
    repeat: !!extra.repeat,
    isComposing: !!extra.isComposing
  };
  if (question.getType() === "radiogroup" && !extra.direct) {
    (question as QuestionRadiogroupModel).onKeyDown(event);
  } else {
    question.onChoiceKeyDown(event);
  }
  return preventDefault;
}

test("bijective base-26 choice codes", () => {
  const samples: Array<[number, string]> = [
    [1, "A"], [2, "B"], [26, "Z"], [27, "AA"], [28, "AB"],
    [52, "AZ"], [53, "BA"], [702, "ZZ"], [703, "AAA"],
    [18278, "ZZZ"], [18279, "AAAA"]
  ];
  for (let i = 0; i < samples.length; i++) {
    expect(indexToChoiceKeyCode(samples[i][0])).toBe(samples[i][1]);
    expect(choiceKeyCodeToIndex(samples[i][1])).toBe(samples[i][0]);
  }
  for (let n = 1; n <= 2000; n++) {
    expect(choiceKeyCodeToIndex(indexToChoiceKeyCode(n))).toBe(n);
  }
  expect(indexToChoiceKeyCode(0)).toBe("");
  expect(indexToChoiceKeyCode(1.5)).toBe("");
  expect(choiceKeyCodeToIndex("")).toBe(0);
  expect(choiceKeyCodeToIndex("a")).toBe(0);
  expect(choiceKeyCodeToIndex("A1")).toBe(0);
});

test("showChoiceShortcutKeys serialization and inheritance", () => {
  const plain = new SurveyModel({ elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] });
  expect(plain.showChoiceShortcutKeys).toBe(false);
  expect(plain.toJSON().showChoiceShortcutKeys).toBeUndefined();
  const plainQuestion = questionOf<QuestionRadiogroupModel>(plain);
  expect(plainQuestion.showShortcutKeys).toBe(false);
  expect(plainQuestion.toJSON().showShortcutKeys).toBeUndefined();
  expect(plainQuestion.isChoiceKeyboardSelectionEnabled).toBe(false);

  const survey = new SurveyModel({
    showChoiceShortcutKeys: true,
    elements: [
      { type: "radiogroup", name: "q1", choices: ["a", "b"] },
      { type: "checkbox", name: "q2", choices: ["a", "b"], showShortcutKeys: false },
      { type: "radiogroup", name: "q3", choices: ["a"], showShortcutKeys: true }
    ]
  });
  const json = survey.toJSON();
  expect(json.showChoiceShortcutKeys).toBe(true);
  const elements = json.pages[0].elements;
  expect(elements[0].showShortcutKeys).toBeUndefined();
  expect(elements[1].showShortcutKeys).toBe(false);
  expect(elements[2].showShortcutKeys).toBe(true);

  const inherited = survey.getQuestionByName("q1") as QuestionRadiogroupModel;
  const turnedOff = survey.getQuestionByName("q2") as QuestionCheckboxModel;
  const turnedOn = survey.getQuestionByName("q3") as QuestionRadiogroupModel;
  expect(inherited.isChoiceKeyboardSelectionEnabled).toBe(true);
  expect(turnedOff.isChoiceKeyboardSelectionEnabled).toBe(false);
  expect(turnedOn.isChoiceKeyboardSelectionEnabled).toBe(true);

  survey.showChoiceShortcutKeys = false;
  turnedOn.showShortcutKeys = undefined;
  expect(turnedOn.isChoiceKeyboardSelectionEnabled).toBe(false);
  turnedOn.showShortcutKeys = true;
  expect(turnedOn.isChoiceKeyboardSelectionEnabled).toBe(true);

  const reloaded = new SurveyModel(json);
  expect((reloaded.getQuestionByName("q2") as QuestionCheckboxModel).isChoiceKeyboardSelectionEnabled).toBe(false);
  expect((reloaded.getQuestionByName("q1") as QuestionRadiogroupModel).isChoiceKeyboardSelectionEnabled).toBe(true);

  const host = new SurveyModel({
    elements: [
      { type: "imagepicker", name: "ip", choices: ["a"] },
      { type: "buttongroup", name: "bg", choices: ["a"] },
      { type: "ranking", name: "rk", choices: ["a", "b"] },
      { type: "radiogroup", name: "rg", choices: ["a"] },
      { type: "checkbox", name: "cb", choices: ["a"] }
    ]
  });
  const expectVisible = (question: QuestionCheckboxBase, visible: boolean): void => {
    const prop = Serializer.findProperty(question.getType(), "showShortcutKeys");
    expect(prop.isVisible("", question)).toBe(visible);
  };
  expectVisible(host.getQuestionByName("ip") as QuestionImagePickerModel, true);
  expectVisible(host.getQuestionByName("bg") as QuestionButtonGroupModel, false);
  expectVisible(host.getQuestionByName("rk") as QuestionRankingModel, false);
  expectVisible(host.getQuestionByName("rg") as QuestionRadiogroupModel, true);
  expectVisible(host.getQuestionByName("cb") as QuestionCheckboxModel, true);
  expect((host.getQuestionByName("rk") as QuestionRankingModel).supportsChoiceKeyboardSelection()).toBe(false);
});

test("letter keys do nothing when the flag is off", () => {
  const survey = createSurvey("radiogroup", 4, {}, { showChoiceShortcutKeys: false });
  const q = questionOf<QuestionRadiogroupModel>(survey);
  const prevented = press(q, "b");
  expect(q.value).toBeUndefined();
  expect(prevented).not.toHaveBeenCalled();
  press(q, "ArrowDown");
  expect(q.value).toBeUndefined();
});

test("radiogroup letters select by position, including multi-letter codes", () => {
  vi.useFakeTimers();
  const four = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 4));
  press(four, "a");
  expect(four.value).toBe("c1");
  press(four, "C");
  expect(four.value).toBe("c3");
  press(four, "e");
  expect(four.value).toBe("c3");
  press(four, "d");
  expect(four.value).toBe("c4");

  const thirty = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 30));
  const prevented = press(thirty, "b");
  expect(thirty.value).toBe("c2");
  expect(prevented).toHaveBeenCalled();

  thirty.clearValue();
  press(thirty, "a");
  expect(thirty.value).toBeUndefined();
  vi.advanceTimersByTime(settings.keyboardInputTimeout - 1);
  expect(thirty.value).toBeUndefined();
  vi.advanceTimersByTime(1);
  expect(thirty.value).toBe("c1");

  thirty.clearValue();
  press(thirty, "a");
  press(thirty, "a");
  expect(thirty.value).toBe("c27");

  thirty.clearValue();
  press(thirty, "a");
  press(thirty, "d");
  expect(thirty.value).toBe("c30");

  thirty.clearValue();
  press(thirty, "a");
  press(thirty, "e");
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(thirty.value).toBeUndefined();

  const wide = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 703));
  press(wide, "z");
  press(wide, "z");
  expect(wide.value).toBe("c702");
  wide.clearValue();
  press(wide, "a");
  press(wide, "a");
  press(wide, "a");
  expect(wide.value).toBe("c703");
});

test("disabled choices keep their letter and special choices share the sequence", () => {
  const survey = createSurvey("radiogroup", 3, {
    choices: ["a", { value: "b", enableIf: "false" }, "c"]
  });
  const q = questionOf<QuestionRadiogroupModel>(survey);
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("A");
  expect(q.getChoiceKeyBadge(q.visibleChoices[1])).toBe("B");
  expect(q.getChoiceKeyBadge(q.visibleChoices[2])).toBe("C");
  expect(q.getItemShortcutKeyClass(q.visibleChoices[1])).toContain("sd-item__shortcut-key--disabled");
  press(q, "a");
  expect(q.value).toBe("a");
  press(q, "b");
  expect(q.value).toBe("a");
  press(q, "c");
  expect(q.value).toBe("c");

  const checks = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 2, {
    showSelectAllItem: true,
    showNoneItem: true,
    showRefuseItem: true,
    showDontKnowItem: true,
    showOtherItem: true
  }));
  const enabled = checks.visibleChoices.filter((item) => checks.getItemEnabled(item));
  expect(enabled.length).toBe(7);
  press(checks, "b");
  expect(checks.value).toEqual([enabled[1].value]);
  press(checks, "a");
  expect(checks.isAllSelected).toBe(true);
  press(checks, "d");
  expect(checks.value).toEqual([enabled[3].value]);
});

test("checkbox letters toggle and follow maxSelectedChoices, None and Select All", () => {
  const q = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 3));
  press(q, "a");
  expect(q.value).toEqual(["c1"]);
  press(q, "a");
  expect(q.value).toEqual([]);
  press(q, "b");
  press(q, "c");
  expect(q.value).toEqual(["c2", "c3"]);

  const limited = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 3, { maxSelectedChoices: 1 }));
  press(limited, "a");
  expect(limited.value).toEqual(["c1"]);
  press(limited, "b");
  expect(limited.value).toEqual(["c1"]);
  press(limited, "a");
  expect(limited.value).toEqual([]);

  const exclusive = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 2, {
    choices: ["a", { value: "b", isExclusive: true }]
  }));
  press(exclusive, "a");
  expect(exclusive.value).toEqual(["a"]);
  press(exclusive, "b");
  expect(exclusive.value).toEqual(["b"]);
  press(exclusive, "a");
  expect(exclusive.value).toEqual(["a"]);

  const selectAll = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 2, { showSelectAllItem: true }));
  press(selectAll, "a");
  expect(selectAll.isAllSelected).toBe(true);
  expect(selectAll.value).toEqual(["c1", "c2"]);
  press(selectAll, "a");
  expect(selectAll.isAllSelected).toBe(false);
  expect(selectAll.value).toEqual([]);
});

test("choice keys ignore modifiers, composition, repeat, digits, comments and read-only states", () => {
  vi.useFakeTimers();
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 4));
  expect(press(q, "b", { ctrlKey: true })).not.toHaveBeenCalled();
  expect(press(q, "b", { altKey: true })).not.toHaveBeenCalled();
  expect(press(q, "b", { metaKey: true })).not.toHaveBeenCalled();
  expect(press(q, "b", { isComposing: true })).not.toHaveBeenCalled();
  expect(q.value).toBeUndefined();
  press(q, "b");
  expect(press(q, "c", { repeat: true })).not.toHaveBeenCalled();
  expect(q.value).toBe("c2");
  expect(press(q, "1")).not.toHaveBeenCalled();
  expect(q.value).toBe("c2");

  const area = document.createElement("textarea");
  document.body.appendChild(area);
  mounted.push(area);
  expect(press(q, "a", { target: area })).not.toHaveBeenCalled();
  expect(q.value).toBe("c2");

  const readOnly = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 4));
  readOnly.readOnly = true;
  press(readOnly, "a");
  expect(readOnly.value).toBeUndefined();

  const display = createSurvey("radiogroup", 4);
  display.mode = "display";
  const displayQuestion = questionOf<QuestionRadiogroupModel>(display);
  press(displayQuestion, "a");
  expect(displayQuestion.value).toBeUndefined();

  const design = createSurvey("radiogroup", 4);
  design.setDesignMode(true);
  const designQuestion = questionOf<QuestionRadiogroupModel>(design);
  press(designQuestion, "a");
  expect(designQuestion.isEmpty()).toBe(true);

  const checks = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 3));
  checks.visibleChoices[1].setIsEnabled(false);
  press(checks, "b", { item: checks.visibleChoices[1], target: inputFor(checks, checks.visibleChoices[1], "checkbox") });
  expect(checks.value).toEqual([]);
  press(checks, "c", { item: checks.visibleChoices[2], target: inputFor(checks, checks.visibleChoices[2], "checkbox") });
  expect(checks.value).toEqual(["c3"]);
});

test("a non-letter key clears a pending code and keeps native behavior", () => {
  vi.useFakeTimers();
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 30));
  press(q, "a");
  const prevented = press(q, "ArrowDown");
  expect(prevented).not.toHaveBeenCalled();
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(q.value).toBeUndefined();

  press(q, "a");
  expect(press(q, " ")).not.toHaveBeenCalled();
  expect(press(q, "Tab")).not.toHaveBeenCalled();
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(q.value).toBeUndefined();
});

test("Enter does not confirm a pending code and still auto-advances; letters do not", () => {
  vi.useFakeTimers();
  const survey = new SurveyModel({
    autoAdvanceEnabled: true,
    showChoiceShortcutKeys: true,
    pages: [
      { elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(30) }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  const q = questionOf<QuestionRadiogroupModel>(survey);
  press(q, "b");
  vi.advanceTimersByTime(settings.autoAdvanceDelay);
  expect(q.value).toBe("c2");
  expect(survey.currentPageNo).toBe(0);

  q.value = "c2";
  press(q, "a");
  press(q, "Enter");
  expect(q.value).toBe("c2");
  vi.advanceTimersByTime(settings.autoAdvanceDelay);
  expect(survey.currentPageNo).toBe(1);
});

test("leaving the question clears a pending code; focus stays for a move inside it", () => {
  vi.useFakeTimers();
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 30));
  const first = inputFor(q, q.visibleChoices[0], "radio");
  const second = inputFor(q, q.visibleChoices[1], "radio");
  press(q, "a", { target: first });
  q.onChoiceFocusOut({ relatedTarget: second });
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(q.value).toBe("c1");

  q.clearValue();
  press(q, "a", { target: first });
  q.onChoiceFocusOut({ relatedTarget: document.createElement("div") });
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(q.value).toBeUndefined();
});

test("an applied code moves focus to the target input", () => {
  const previous = SurveyElement.ScrollElementToViewCore;
  SurveyElement.ScrollElementToViewCore = (() => false) as any;
  try {
    const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 4));
    q.visibleChoices.forEach((item) => inputFor(q, item, "radio"));
    press(q, "c");
    expect(q.value).toBe("c3");
    expect(document.activeElement && (document.activeElement as HTMLElement).id).toBe(q.getItemId(q.visibleChoices[2]));
  } finally {
    SurveyElement.ScrollElementToViewCore = previous;
  }
});

test("imagepicker letters select, toggle, keep disabled letters and honor the question flag", () => {
  vi.useFakeTimers();
  const single = questionOf<QuestionImagePickerModel>(createSurvey("imagepicker", 4, { choices: imageChoices(4) }));
  expect(single.supportsChoiceKeyboardSelection()).toBe(true);
  press(single, "b");
  expect(single.value).toBe("c2");
  press(single, "a");
  expect(single.value).toBe("c1");

  const multi = questionOf<QuestionImagePickerModel>(createSurvey("imagepicker", 3, {
    multiSelect: true,
    choices: imageChoices(3)
  }));
  press(multi, "a");
  expect(multi.value).toEqual(["c1"]);
  press(multi, "c");
  expect(multi.value).toEqual(["c1", "c3"]);
  press(multi, "a");
  expect(multi.value).toEqual(["c3"]);

  const skipped = questionOf<QuestionImagePickerModel>(createSurvey("imagepicker", 4, {
    choices: [
      { value: "c1", imageLink: "img1" },
      { value: "c2", imageLink: "img2", enableIf: "false" },
      { value: "c3" },
      { value: "c4", imageLink: "img4" }
    ]
  }));
  expect(skipped.visibleChoices.map((item) => skipped.getChoiceKeyBadge(item))).toEqual(["A", "B", "C", "D"]);
  press(skipped, "a");
  expect(skipped.value).toBe("c1");
  press(skipped, "b");
  expect(skipped.value).toBe("c1");
  press(skipped, "c");
  expect(skipped.value).toBe("c1");
  press(skipped, "d");
  expect(skipped.value).toBe("c4");

  const off = questionOf<QuestionImagePickerModel>(createSurvey("imagepicker", 4, {
    showShortcutKeys: false,
    choices: imageChoices(4)
  }));
  press(off, "b");
  expect(off.value).toBeUndefined();

  const wide = questionOf<QuestionImagePickerModel>(createSurvey("imagepicker", 30, { choices: imageChoices(30) }));
  press(wide, "a");
  expect(wide.value).toBeUndefined();
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(wide.value).toBe("c1");
  wide.clearValue();
  press(wide, "a");
  press(wide, "b");
  expect(wide.value).toBe("c28");
});

test("badges track the visible position for every supported type", () => {
  const types = ["radiogroup", "checkbox", "imagepicker"];
  for (let t = 0; t < types.length; t++) {
    const question = questionOf<QuestionCheckboxBase>(createSurvey(types[t], 3, types[t] === "imagepicker" ? { choices: imageChoices(3) } : {}));
    expect(question.canShowChoiceKeys).toBe(true);
    expect(question.visibleChoices.map((item) => question.getChoiceKeyBadge(item))).toEqual(["A", "B", "C"]);
    expect(question.getItemAriaKeyShortcuts(question.visibleChoices[0])).toBe("A");
    expect(question.getItemShortcutKeyClass(question.visibleChoices[0])).toBe(question.cssClasses.itemShortcutKey);
  }
});

test("badges follow visibleIf, choicesVisibleIf and choicesEnableIf", () => {
  const survey = new SurveyModel({
    showChoiceShortcutKeys: true,
    elements: [
      { type: "text", name: "gate" },
      {
        type: "radiogroup",
        name: "q",
        choices: ["c1", { value: "c2", visibleIf: "{gate} = 'yes'" }, "c3"]
      }
    ]
  });
  const q = questionOf<QuestionRadiogroupModel>(survey);
  expect(q.visibleChoices.map((item) => q.getChoiceKeyBadge(item))).toEqual(["A", "B"]);
  expect(q.visibleChoices.map((item) => item.value)).toEqual(["c1", "c3"]);
  survey.setValue("gate", "yes");
  expect(q.visibleChoices.map((item) => item.value)).toEqual(["c1", "c2", "c3"]);
  expect(q.visibleChoices.map((item) => q.getChoiceKeyBadge(item))).toEqual(["A", "B", "C"]);

  const filtered = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 3, {
    choicesVisibleIf: "{item} != 'c2'"
  }));
  expect(filtered.visibleChoices.map((item) => item.value)).toEqual(["c1", "c3"]);
  expect(filtered.visibleChoices.map((item) => filtered.getChoiceKeyBadge(item))).toEqual(["A", "B"]);

  const enabled = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 3, {
    choicesEnableIf: "{item} != 'c2'"
  }));
  expect(enabled.visibleChoices.map((item) => enabled.getChoiceKeyBadge(item))).toEqual(["A", "B", "C"]);
  expect(enabled.getItemEnabled(enabled.visibleChoices[1])).toBe(false);
  press(enabled, "b");
  expect(enabled.value).toEqual([]);
  press(enabled, "c");
  expect(enabled.value).toEqual(["c3"]);
});

test("special choices keep visual order with and without separateSpecialChoices", () => {
  const joined = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 2, {
    showSelectAllItem: true,
    showNoneItem: true,
    showOtherItem: true,
    separateSpecialChoices: false
  }));
  expect(joined.visibleChoices.map((item) => joined.getChoiceKeyBadge(item))).toEqual(["A", "B", "C", "D", "E"]);
  expect(joined.getChoiceKeyBadge(joined.selectAllItem)).toBe("A");
  expect(joined.getChoiceKeyBadge(joined.noneItem)).toBe("D");
  expect(joined.getChoiceKeyBadge(joined.otherItem)).toBe("E");

  const separated = questionOf<QuestionCheckboxModel>(createSurvey("checkbox", 2, {
    showSelectAllItem: true,
    showNoneItem: true,
    showOtherItem: true,
    separateSpecialChoices: true
  }));
  const rendered = separated.headItems.concat(separated.bodyItems, separated.footItems);
  expect(rendered.map((item) => separated.getChoiceKeyBadge(item))).toEqual(
    separated.visibleChoices.map((item) => separated.getChoiceKeyBadge(item))
  );
  expect(separated.getChoiceKeyBadge(separated.selectAllItem)).toBe("A");
  expect(separated.getChoiceKeyBadge(separated.noneItem)).toBe("D");
});

test("a question flag false hides badges even when the survey flag is on", () => {
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 2, { showShortcutKeys: false }));
  expect(q.canShowChoiceKeys).toBe(false);
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[0])).toBeUndefined();
  q.showShortcutKeys = undefined;
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("A");
  q.showShortcutKeys = false;
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("");
});

test("badges hide and keys stop on mobile, readonly and preview", () => {
  const mobile = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 3));
  mobile.isMobile = true;
  expect(mobile.canShowChoiceKeys).toBe(false);
  expect(mobile.getChoiceKeyBadge(mobile.visibleChoices[0])).toBe("");
  press(mobile, "a");
  expect(mobile.value).toBeUndefined();
  mobile.isMobile = false;
  expect(mobile.getChoiceKeyBadge(mobile.visibleChoices[0])).toBe("A");
  press(mobile, "b");
  expect(mobile.value).toBe("c2");

  const readOnly = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 3));
  readOnly.readOnly = true;
  expect(readOnly.getChoiceKeyBadge(readOnly.visibleChoices[0])).toBe("");
  press(readOnly, "a");
  expect(readOnly.value).toBeUndefined();

  const preview = createSurvey("radiogroup", 3);
  expect(preview.showPreview()).toBe(true);
  const previewQuestion = questionOf<QuestionRadiogroupModel>(preview);
  expect(previewQuestion.isPreviewStyle).toBe(true);
  expect(previewQuestion.getChoiceKeyBadge(previewQuestion.visibleChoices[0])).toBe("");
  press(previewQuestion, "a");
  expect(previewQuestion.value).toBeUndefined();
});

test("design mode shows badges without keyboard selection and skips creator service items", () => {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    showChoiceShortcutKeys: true,
    elements: [{
      type: "checkbox",
      name: "q",
      choices: ["a", "b"],
      showNoneItem: true
    }]
  });
  const q = questionOf<QuestionCheckboxModel>(survey);
  expect(q.canShowChoiceKeys).toBe(true);
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("A");
  expect(q.getChoiceKeyBadge(q.choices[1])).toBe("B");
  expect(q.getChoiceKeyBadge(q.noneItem)).toBe("C");
  expect(q.getChoiceKeyBadge(q.newItem)).toBe("");
  expect(q.getChoiceKeyBadge(q.selectAllItem)).toBe("");
  press(q, "a");
  expect(q.isEmpty()).toBe(true);
});

test("aria-keyshortcuts is set only for a single letter", () => {
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 27));
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("A");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[0])).toBe("A");
  expect(q.getChoiceKeyBadge(q.visibleChoices[26])).toBe("AA");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[26])).toBeUndefined();
  q.visibleChoices[0].setIsEnabled(false);
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("A");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[0])).toBeUndefined();
});

test("dispose drops a pending choice code", () => {
  vi.useFakeTimers();
  const survey = createSurvey("radiogroup", 30);
  const q = questionOf<QuestionRadiogroupModel>(survey);
  press(q, "a");
  q.dispose();
  vi.advanceTimersByTime(settings.keyboardInputTimeout);
  expect(q.isEmpty()).toBe(true);
});
