import { SurveyModel } from "../src/survey";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionCheckboxBase } from "../src/question_baseselect";
import { indexToChoiceKeyCode, choiceKeyCodeToIndex } from "../src/utils/choice-key-codes";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { QuestionButtonGroupModel } from "../src/question_buttongroup";
import { QuestionRankingModel } from "../src/question_ranking";
import { JsonObject, Serializer } from "../src/jsonobject";
import { settings } from "../src/settings";
import { SurveyElement } from "../src/survey-element";
import { ItemValue } from "../src/itemvalue";
import { ComponentCollection } from "../src/question_custom";
import { afterEach, describe, expect, test, vi } from "vitest";

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
    choiceShortcutsEnabled: true,
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

test("choiceShortcutsEnabled serialization and inheritance", () => {
  expect(Serializer.findProperty("survey", "choiceShortcutsEnabled").getDefaultValue(undefined)).toBe(false);
  expect(Serializer.findProperty("checkbox", "choiceShortcutsEnabled").defaultValueFunc(undefined)).toBeUndefined();

  const plain = new SurveyModel({ elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] });
  expect(plain.choiceShortcutsEnabled).toBe(false);
  expect(plain.toJSON().choiceShortcutsEnabled).toBeUndefined();
  const plainQuestion = questionOf<QuestionRadiogroupModel>(plain);
  expect(plainQuestion.choiceShortcutsEnabled).toBeUndefined();
  expect(plainQuestion.toJSON().choiceShortcutsEnabled).toBeUndefined();
  expect(plainQuestion.isChoiceKeyboardSelectionEnabled).toBe(false);

  const survey = new SurveyModel({
    choiceShortcutsEnabled: true,
    elements: [
      { type: "radiogroup", name: "q1", choices: ["a", "b"] },
      { type: "checkbox", name: "q2", choices: ["a", "b"], choiceShortcutsEnabled: false },
      { type: "radiogroup", name: "q3", choices: ["a"], choiceShortcutsEnabled: true }
    ]
  });
  const json = survey.toJSON();
  expect(json.choiceShortcutsEnabled).toBe(true);
  const elements = json.pages[0].elements;
  expect(elements[0].choiceShortcutsEnabled).toBeUndefined();
  expect(elements[1].choiceShortcutsEnabled).toBe(false);
  expect(elements[2].choiceShortcutsEnabled).toBe(true);

  const inherited = survey.getQuestionByName("q1") as QuestionRadiogroupModel;
  const turnedOff = survey.getQuestionByName("q2") as QuestionCheckboxModel;
  const turnedOn = survey.getQuestionByName("q3") as QuestionRadiogroupModel;
  expect(inherited.choiceShortcutsEnabled).toBeUndefined();
  expect(turnedOff.choiceShortcutsEnabled).toBe(false);
  expect(turnedOn.choiceShortcutsEnabled).toBe(true);
  expect(inherited.isChoiceKeyboardSelectionEnabled).toBe(true);
  expect(turnedOff.isChoiceKeyboardSelectionEnabled).toBe(false);
  expect(turnedOn.isChoiceKeyboardSelectionEnabled).toBe(true);

  survey.choiceShortcutsEnabled = false;
  turnedOn.choiceShortcutsEnabled = undefined;
  expect(turnedOn.choiceShortcutsEnabled).toBeUndefined();
  expect(turnedOn.isChoiceKeyboardSelectionEnabled).toBe(false);
  turnedOn.choiceShortcutsEnabled = true;
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
    const prop = Serializer.findProperty(question.getType(), "choiceShortcutsEnabled");
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
  const survey = createSurvey("radiogroup", 4, {}, { choiceShortcutsEnabled: false });
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
    choiceShortcutsEnabled: true,
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
    choiceShortcutsEnabled: false,
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
    choiceShortcutsEnabled: true,
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

test("dropdown choices rendered as radio items have no shortcut badge", () => {
  const survey = new SurveyModel({
    choiceShortcutsEnabled: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q");
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[0])).toBeUndefined();
  expect(q.getItemShortcutKeyClass(q.visibleChoices[0])).toBe("");
  q.onChoiceKeyDown({ key: "a", target: { tagName: "input", type: "radio", id: "x" } });
  q.onChoiceFocusOut({});
  expect(q.value).toBeUndefined();
});

test("a question flag false hides badges even when the survey flag is on", () => {
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 2, { choiceShortcutsEnabled: false }));
  expect(q.canShowChoiceKeys).toBe(false);
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("");
  expect(q.getItemAriaKeyShortcuts(q.visibleChoices[0])).toBeUndefined();
  q.choiceShortcutsEnabled = undefined;
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("A");
  q.choiceShortcutsEnabled = false;
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
    choiceShortcutsEnabled: true,
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

test("survey choiceShortcutsEnabled toggles badges after load", () => {
  const survey = new SurveyModel({
    elements: [{ type: "checkbox", name: "q", choices: ["a", "b"] }]
  });
  survey.setDesignMode(true);
  const q = questionOf<QuestionCheckboxModel>(survey);
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("");
  survey.choiceShortcutsEnabled = true;
  expect(q.canShowChoiceKeys).toBe(true);
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("A");
  expect(q.getChoiceKeyBadge(q.choices[1])).toBe("B");
  survey.choiceShortcutsEnabled = false;
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("");
});

test("survey choiceShortcutsEnabled toggles badges for a question added after the survey exists", () => {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  const page = survey.addNewPage("page1");
  const q = new QuestionCheckboxModel("q");
  new JsonObject().toObject({ name: "q", choices: ["a", "b"] }, q);
  page.addElement(q);
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("");
  survey.choiceShortcutsEnabled = true;
  expect(q.canShowChoiceKeys).toBe(true);
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("A");
  expect(q.getChoiceKeyBadge(q.choices[1])).toBe("B");
  survey.choiceShortcutsEnabled = false;
  expect(q.getChoiceKeyBadge(q.choices[0])).toBe("");
});

test("badges stay when choices are rebuilt with the same values", () => {
  const q = questionOf<QuestionRadiogroupModel>(createSurvey("radiogroup", 3));
  expect(q.visibleChoices.map((item) => q.getChoiceKeyBadge(item))).toEqual(["A", "B", "C"]);
  const rebuilt = q.choices.map((item) => new ItemValue(item.value));
  q.choices.splice(0, q.choices.length, ...rebuilt);
  expect(q.choices.map((item) => item.value)).toEqual(["c1", "c2", "c3"]);
  expect(q.visibleChoices.map((item) => item.value)).toEqual(["c1", "c2", "c3"]);
  expect(q.visibleChoices.map((item) => q.getChoiceKeyBadge(item))).toEqual(["A", "B", "C"]);
});

test("tagbox does not take choice shortcuts from checkbox", () => {
  const survey = new SurveyModel({
    choiceShortcutsEnabled: true,
    elements: [{ type: "tagbox", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q") as QuestionTagboxModel;
  expect(q.supportsChoiceKeyboardSelection()).toBe(false);
  expect(q.canShowChoiceKeys).toBe(false);
  expect(q.getChoiceKeyBadge(q.visibleChoices[0])).toBe("");
  expect(Serializer.findProperty("tagbox", "choiceShortcutsEnabled").isVisible("", q)).toBe(false);
  q.onChoiceKeyDown({ key: "a", preventDefault: () => {}, target: { tagName: "input", type: "checkbox", id: q.getItemId(q.visibleChoices[0]) } });
  expect(q.isEmpty()).toBe(true);
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

describe("choice badges bind only the questions that can show them", () => {
  function handlerCount(obj: any): number {
    return (obj["onPropChangeFunctions"] || []).length;
  }
  // A panel with checkboxes, a dynamic panel with a checkbox in each panel and a dropdown matrix with a
  // checkbox column; the sizes vary, the structure does not.
  function containersJson(panelQuestions: number, panelCount: number, rowCount: number, surveyExtra: any = {}): any {
    const panelElements = new Array<any>();
    for (let i = 1; i <= panelQuestions; i++) panelElements.push({ type: "checkbox", name: "pq" + i, choices: ["a", "b"] });
    const rows = new Array<string>();
    for (let i = 1; i <= rowCount; i++) rows.push("r" + i);
    return Object.assign({
      elements: [
        { type: "radiogroup", name: "rg", choices: ["a", "b", "c"] },
        { type: "panel", name: "panel", elements: panelElements },
        { type: "paneldynamic", name: "pd", panelCount: panelCount, templateElements: [{ type: "checkbox", name: "pdq", choices: ["a", "b"] }] },
        { type: "matrixdropdown", name: "mx", rows: rows, columns: [{ name: "col", cellType: "checkbox", choices: ["a", "b"] }] }
      ]
    }, surveyExtra);
  }
  // Builds the dynamic panel's panels and the matrix rows, as rendering does.
  function createContainersSurvey(panelQuestions: number, panelCount: number, rowCount: number, surveyExtra: any = {}): SurveyModel {
    const survey = new SurveyModel(containersJson(panelQuestions, panelCount, rowCount, surveyExtra));
    buildContainers(survey);
    return survey;
  }
  function buildContainers(survey: SurveyModel): void {
    (<any>survey.getQuestionByName("pd")).panels;
    (<any>survey.getQuestionByName("mx")).visibleRows;
  }
  function containerQuestions(survey: SurveyModel): { [name: string]: QuestionCheckboxBase[] } {
    const pd: any = survey.getQuestionByName("pd");
    const mx: any = survey.getQuestionByName("mx");
    return {
      top: [<QuestionCheckboxBase>survey.getQuestionByName("rg")],
      panel: <QuestionCheckboxBase[]>(<any>survey.getPanelByName("panel")).questions,
      pd: pd.panels.map((p: any) => p.getQuestionByName("pdq")),
      mx: mx.visibleRows.map((row: any) => row.cells[0].question)
    };
  }
  function allContainerQuestions(survey: SurveyModel): QuestionCheckboxBase[] {
    const groups = containerQuestions(survey);
    return [...groups.top, ...groups.panel, ...groups.pd, ...groups.mx];
  }
  function containerCounts(survey: SurveyModel): { [name: string]: number } {
    return {
      survey: handlerCount(survey),
      page: handlerCount(survey.pages[0]),
      panel: handlerCount(survey.getPanelByName("panel")),
      pd: handlerCount(survey.getQuestionByName("pd")),
      mx: handlerCount(survey.getQuestionByName("mx"))
    };
  }
  // Both the badge a renderer reads and the badge stored on the item: getChoiceKeyBadge() checks the
  // gate live and hides a stale stored badge.
  function expectBadges(q: QuestionCheckboxBase, shown: boolean, label: string): void {
    const keyed = q.getChoiceKeyItems();
    const expected = keyed.map((_, i) => shown ? indexToChoiceKeyCode(i + 1) : "");
    expect(keyed.length > 0, label + ": " + q.name + " has choices").toBe(true);
    expect(keyed.map(item => q.getChoiceKeyBadge(item)), label + ": " + q.name + " shown").toEqual(expected);
    expect(keyed.map(item => item.getPropertyValue("choiceKey") || ""), label + ": " + q.name + " stored").toEqual(expected);
  }
  function expectAllBadges(questions: QuestionCheckboxBase[], shown: boolean, label: string): void {
    expect(questions.length > 0, label + ": there are questions").toBe(true);
    questions.forEach(q => expectBadges(q, shown, label));
  }
  function isBound(q: QuestionCheckboxBase): boolean {
    return !!q.dependencies["choiceKeyState"];
  }

  test("with shortcuts off the survey and the page hold the same handlers for 1 or 110 select questions", () => {
    const small = new SurveyModel({ elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"] }] });
    const elements = new Array<any>();
    for (let i = 1; i <= 50; i++) elements.push({ type: "radiogroup", name: "r" + i, choices: ["a", "b"] });
    for (let i = 1; i <= 50; i++) elements.push({ type: "checkbox", name: "c" + i, choices: ["a", "b"] });
    for (let i = 1; i <= 10; i++) elements.push({ type: "imagepicker", name: "i" + i, choices: imageChoices(2) });
    const large = new SurveyModel({ elements: elements });
    expect(handlerCount(large), "survey").toBe(handlerCount(small));
    expect(handlerCount(large.pages[0]), "page").toBe(handlerCount(small.pages[0]));
  });
  test("with shortcuts off the handlers of the survey and of the containers do not grow with questions, panels or rows", () => {
    const small = createContainersSurvey(1, 1, 1);
    const large = createContainersSurvey(20, 5, 10);
    expect(allContainerQuestions(large).length).toBe(1 + 20 + 5 + 10);
    expect(containerCounts(large)).toEqual(containerCounts(small));
  });
  test("enabling the survey flag at runtime shows the badges of every question, nested ones included", () => {
    const survey = createContainersSurvey(20, 5, 10);
    expectAllBadges(allContainerQuestions(survey), false, "off");
    survey.choiceShortcutsEnabled = true;
    expectAllBadges(allContainerQuestions(survey), true, "on");
  });
  test("each gate hides the badges and gives them back after the flag is enabled at runtime", () => {
    const survey = createContainersSurvey(20, 5, 10);
    survey.choiceShortcutsEnabled = true;
    const groups = containerQuestions(survey);
    const all = allContainerQuestions(survey);
    const others = (exclude: QuestionCheckboxBase[]) => all.filter(q => exclude.indexOf(q) < 0);
    survey.readOnly = true;
    expectAllBadges(all, false, "survey read-only");
    survey.readOnly = false;
    expectAllBadges(all, true, "survey editable");
    survey.mode = "display";
    expectAllBadges(all, false, "display mode");
    survey.mode = "edit";
    expectAllBadges(all, true, "edit mode");
    const one = groups.panel[0];
    one.readOnly = true;
    expectBadges(one, false, "question read-only");
    expectAllBadges(others([one]), true, "the other questions");
    one.readOnly = false;
    expectAllBadges(all, true, "question editable");
    const panel = survey.getPanelByName("panel");
    panel.readOnly = true;
    expectAllBadges(groups.panel, false, "panel read-only");
    expectAllBadges(others(groups.panel), true, "outside the panel");
    panel.readOnly = false;
    expectAllBadges(all, true, "panel editable");
    survey.setIsMobile(true);
    expectAllBadges(all, false, "mobile");
    survey.setIsMobile(false);
    expectAllBadges(all, true, "desktop");
  });
  // Opens the gate that was closed while the badges were bound or enabled, then closes the other one.
  function checkBoundWhileClosed(survey: SurveyModel, open: () => void, closeOther: () => void): void {
    const all = allContainerQuestions(survey);
    expectAllBadges(all, false, "loaded");
    survey.choiceShortcutsEnabled = true;
    expectAllBadges(all, false, "enabled while closed");
    open();
    expectAllBadges(all, true, "open");
    closeOther();
    expectAllBadges(all, false, "the other gate closed");
  }
  test("questions loaded while mobile follow read-only after the flag is enabled and the survey returns to desktop", () => {
    const survey = new SurveyModel();
    survey.setIsMobile(true);
    survey.fromJSON(containersJson(2, 2, 2));
    buildContainers(survey);
    checkBoundWhileClosed(survey, () => survey.setIsMobile(false), () => { survey.readOnly = true; });
  });
  test("questions whose flag is enabled while mobile follow read-only after the survey returns to desktop", () => {
    const survey = createContainersSurvey(2, 2, 2);
    survey.setIsMobile(true);
    checkBoundWhileClosed(survey, () => survey.setIsMobile(false), () => { survey.readOnly = true; });
  });
  test("questions loaded while read-only follow mobile after the flag is enabled and the survey becomes editable", () => {
    const survey = new SurveyModel();
    survey.readOnly = true;
    survey.fromJSON(containersJson(2, 2, 2));
    expect(survey.readOnly, "still read-only after loading").toBe(true);
    buildContainers(survey);
    checkBoundWhileClosed(survey, () => { survey.readOnly = false; }, () => survey.setIsMobile(true));
  });
  test("questions whose flag is enabled while read-only follow mobile after the survey becomes editable", () => {
    const survey = createContainersSurvey(2, 2, 2);
    survey.readOnly = true;
    checkBoundWhileClosed(survey, () => { survey.readOnly = false; }, () => survey.setIsMobile(true));
  });
  test("the question's own flag binds, unbinds and gives the survey flag back", () => {
    const own = new SurveyModel({ elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] });
    const ownQ = <QuestionRadiogroupModel>own.getQuestionByName("q");
    ownQ.choiceShortcutsEnabled = true;
    expect(isBound(ownQ), "own true: bound").toBe(true);
    expectBadges(ownQ, true, "own true, survey off");

    const offJson = { elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] };
    const reference = new SurveyModel(offJson);
    const survey = new SurveyModel({ choiceShortcutsEnabled: true, elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"], choiceShortcutsEnabled: false }] });
    const q = <QuestionRadiogroupModel>survey.getQuestionByName("q");
    expectBadges(q, false, "own false, survey on");
    expect(isBound(q), "own false: not bound").toBe(false);
    expect(handlerCount(survey), "own false: survey handlers").toBe(handlerCount(reference));
    expect(handlerCount(survey.pages[0]), "own false: page handlers").toBe(handlerCount(reference.pages[0]));
    expect(handlerCount(q), "own false: question handlers").toBe(handlerCount(reference.getQuestionByName("q")));
    q.choiceShortcutsEnabled = undefined;
    expectBadges(q, true, "own undefined, survey on");
    survey.choiceShortcutsEnabled = false;
    expectBadges(q, false, "own undefined, survey off");
    expect(isBound(q), "own undefined, survey off: not bound").toBe(false);
  });
  test("the survey flag reaches custom and composite content, detail panels, choice panels and nested dynamic panels", () => {
    ComponentCollection.Instance.add({ name: "cskcustom", questionJSON: { type: "radiogroup", choices: ["a", "b"] } });
    ComponentCollection.Instance.add({ name: "cskcomposite", elementsJSON: [{ type: "checkbox", name: "inner", choices: ["a", "b"] }] });
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "cskcustom", name: "cu" },
          { type: "cskcomposite", name: "cp" },
          {
            type: "matrixdynamic", name: "md", rowCount: 1, detailPanelMode: "underRow",
            columns: [{ name: "col", cellType: "text" }],
            detailElements: [{ type: "checkbox", name: "detailQ", choices: ["a", "b"] }]
          },
          { type: "radiogroup", name: "withPanel", defaultValue: "a", choices: [{ value: "a", elements: [{ type: "checkbox", name: "choicePanelQ", choices: ["a", "b"] }] }, "b"] },
          {
            type: "paneldynamic", name: "outer", panelCount: 1,
            templateElements: [{ type: "paneldynamic", name: "inner", panelCount: 2, templateElements: [{ type: "radiogroup", name: "deepQ", choices: ["a", "b"] }] }]
          }
        ]
      });
      const row = (<any>survey.getQuestionByName("md")).visibleRows[0];
      row.showDetailPanel();
      const outer: any = survey.getQuestionByName("outer");
      const inner: any = outer.panels[0].getQuestionByName("inner");
      const nested: { [kind: string]: QuestionCheckboxBase } = {
        "custom content": (<any>survey.getQuestionByName("cu")).contentQuestion,
        "composite content": (<any>survey.getQuestionByName("cp")).contentPanel.getQuestionByName("inner"),
        "detail panel": row.detailPanel.getQuestionByName("detailQ"),
        "choice panel": (<any>survey.getQuestionByName("withPanel")).choices[0].panel.getQuestionByName("choicePanelQ"),
        "nested dynamic panel, item 1": inner.panels[0].getQuestionByName("deepQ"),
        "nested dynamic panel, item 2": inner.panels[1].getQuestionByName("deepQ")
      };
      const kinds = Object.keys(nested);
      kinds.forEach(kind => expect(isBound(nested[kind]), kind + ": not bound while off").toBe(false));
      survey.choiceShortcutsEnabled = true;
      kinds.forEach(kind => expectBadges(nested[kind], true, kind));
      survey.choiceShortcutsEnabled = false;
      kinds.forEach(kind => {
        expectBadges(nested[kind], false, kind + ", off again");
        expect(isBound(nested[kind]), kind + ": unbound").toBe(false);
      });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("disabling the survey flag at runtime removes the badges and the handlers", () => {
    const survey = createContainersSurvey(20, 5, 10);
    survey.choiceShortcutsEnabled = true;
    expectAllBadges(allContainerQuestions(survey), true, "on");
    survey.choiceShortcutsEnabled = false;
    expectAllBadges(allContainerQuestions(survey), false, "off");
    expect(containerCounts(survey)).toEqual(containerCounts(createContainersSurvey(1, 1, 1)));
    allContainerQuestions(survey).forEach(q => expect(isBound(q), q.name + " bound").toBe(false));
  });
  test("a question added after load binds only with the flag on", () => {
    const on = new SurveyModel({ choiceShortcutsEnabled: true, elements: [{ type: "text", name: "t" }] });
    const added = <QuestionRadiogroupModel>on.pages[0].addNewQuestion("radiogroup", "q");
    added.choices = ["a", "b"];
    expectBadges(added, true, "added, flag on");

    const off = new SurveyModel({ elements: [{ type: "text", name: "t" }] });
    const surveyCount = handlerCount(off);
    const addedOff = <QuestionRadiogroupModel>off.pages[0].addNewQuestion("radiogroup", "q");
    addedOff.choices = ["a", "b"];
    expectBadges(addedOff, false, "added, flag off");
    expect(isBound(addedOff), "added, flag off: not bound").toBe(false);
    expect(handlerCount(off), "added, flag off: survey handlers").toBe(surveyCount);
  });
  test("a standalone question with its own flag on rebinds when it joins a survey and follows its display mode", () => {
    const standalone = new QuestionRadiogroupModel("s");
    standalone.choices = ["a", "b"];
    standalone.choiceShortcutsEnabled = true;
    const target = new SurveyModel({ elements: [{ type: "text", name: "t" }] });
    target.pages[0].addElement(standalone);
    expectBadges(standalone, true, "joined the survey");
    target.mode = "display";
    expectBadges(standalone, false, "display mode");
    target.mode = "edit";
    expectBadges(standalone, true, "edit mode");
  });
  test("disposing the survey leaves no handler of the badges on any object", () => {
    const survey = createContainersSurvey(2, 2, 2);
    survey.choiceShortcutsEnabled = true;
    const registrations = new Array<{ obj: any, prop: string, id: string }>();
    allContainerQuestions(survey).forEach(q => {
      const updater: any = q.dependencies["choiceKeyState"];
      expect(!!updater, q.name + " bound").toBe(true);
      registrations.push(...updater.getDependencies().dependencies);
    });
    expect(registrations.length > 0).toBe(true);
    survey.dispose();
    registrations.forEach(reg => {
      const left = (reg.obj["onPropChangeFunctions"] || []).filter((item: any) => item.key === reg.id);
      expect(left.length, reg.prop + " on " + (reg.obj.name || reg.obj.getType())).toBe(0);
    });
  });
  test("the survey and question flags round-trip through JSON and show badges after load", () => {
    const json = {
      choiceShortcutsEnabled: true,
      pages: [{
        name: "page1",
        elements: [
          { type: "radiogroup", name: "q1", choices: ["a", "b"], choiceShortcutsEnabled: true },
          { type: "checkbox", name: "q2", choices: ["a", "b"] }
        ]
      }]
    };
    const survey = new SurveyModel(json);
    expect(survey.toJSON()).toEqual(json);
    expectBadges(<QuestionCheckboxBase>survey.getQuestionByName("q1"), true, "q1");
    expectBadges(<QuestionCheckboxBase>survey.getQuestionByName("q2"), true, "q2");
  });
});
