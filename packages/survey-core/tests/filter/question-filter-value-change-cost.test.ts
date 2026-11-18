import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterToolbars } from "../../src/filter/filter-toolbars";

// A Dynamic Matrix of 15 columns of mixed types with 50 records, a Filter Control bound to it, and 10
// text questions outside both.
const choices = ["a", "b", "c", "d"];
const columns = [
  { name: "name" },
  { name: "qty", cellType: "text", inputType: "number" },
  { name: "date", cellType: "text", inputType: "date" },
  { name: "notes", cellType: "comment" },
  { name: "country", cellType: "dropdown", choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
  { name: "tags", cellType: "checkbox", choices: choices },
  { name: "size", cellType: "radiogroup", choices: choices },
  { name: "labels", cellType: "tagbox", choices: choices },
  { name: "active", cellType: "boolean" },
  { name: "score", cellType: "rating" },
  { name: "city", cellType: "dropdown", choices: ["Berlin", "Paris"] },
  { name: "email", cellType: "text", inputType: "email" },
  { name: "color", cellType: "dropdown", choices: ["red", "green"] },
  { name: "level", cellType: "radiogroup", choices: ["1", "2", "3"] },
  { name: "flags", cellType: "checkbox", choices: ["x", "y"] }
];
function createSurvey(filter: any = {}): SurveyModel {
  const elements: Array<any> = [{ type: "matrixdynamic", name: "m", columns: columns },
    Object.assign({ type: "filter", name: "f", source: "m" }, filter)];
  for (let i = 1; i <= 10; i++) {
    elements.push({ type: "text", name: "t" + i });
  }
  const survey = new SurveyModel({ elements: elements });
  const records: Array<any> = [];
  for (let i = 0; i < 50; i++) {
    records.push({ name: "n" + i, qty: i, country: i % 2 ? "de" : "fr", tags: ["a"], active: !!(i % 2) });
  }
  survey.getQuestionByName("m").value = records;
  return survey;
}
const preset = { items: [{ name: "p", expression: "{country} = 'de' and {qty} > 5 and {tags} anyof ['a']" }], defaultItem: "p" };

interface ICost { conditionJson: number, sourceFields: number, controlFields: number, toolbarUpdates: number, properties: Array<string> }
function measure(survey: SurveyModel, fn: () => void): ICost {
  const q = <QuestionFilterModel>survey.getQuestionByName("f");
  const matrix: any = survey.getQuestionByName("m");
  const conditionJson = vi.spyOn(Question.prototype, "getConditionJson");
  const sourceFields = vi.spyOn(matrix, "getFilterFields");
  const controlFields = vi.spyOn(q, "getFilterFields");
  const toolbarUpdates = vi.spyOn(FilterToolbars.prototype, "update");
  const properties: Array<string> = [];
  const handler = (_: any, options: any): void => { properties.push(options.name); };
  q.onPropertyChanged.add(handler);
  try {
    fn();
    return { conditionJson: conditionJson.mock.calls.length, sourceFields: sourceFields.mock.calls.length,
      controlFields: controlFields.mock.calls.length, toolbarUpdates: toolbarUpdates.mock.calls.length, properties: properties };
  } finally {
    q.onPropertyChanged.remove(handler);
    vi.restoreAllMocks();
  }
}

// The bounds below are the counts measured when they were set (report 05: before them a value change
// read 30 condition jsons with no preset on and 132 with one, and built the source's field list 36
// times). A change that raises one has to say why.
describe("QuestionFilterModel: the work one survey value change costs", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  [{ name: "no preset", filter: {} }, { name: "a preset of 3 conditions on", filter: preset }].forEach((scenario: any) => {
    describe(scenario.name, () => {
      function create(): { survey: SurveyModel, q: QuestionFilterModel } {
        const survey = createSurvey(scenario.filter);
        const q = <QuestionFilterModel>survey.getQuestionByName("f");
        expect(q.chipsToolbar.getActionById("sv-filter-field-flags"), "the chips row is built").toBeTruthy();
        return { survey: survey, q: q };
      }
      test("a value the filter does not read: no condition json, no toolbar update", () => {
        const { survey } = create();
        const cost = measure(survey, () => { survey.setValue("t1", "x"); });
        expect(cost.properties, "#1: nothing of the control changes").toEqual([]);
        expect([cost.conditionJson, cost.toolbarUpdates], "#2").toEqual([0, 0]);
        expect(cost.sourceFields, "#3: one read for runCondition, one for locStrsChanged").toBeLessThanOrEqual(2);
      });
      test("one pass over the toolbars reads the field list once and each field's condition json once", () => {
        const { survey, q } = create();
        const cost = measure(survey, () => { q.allowAddItems = false; });
        expect(cost.toolbarUpdates, "#1").toBe(1);
        expect(cost.conditionJson, "#2: one per field").toBeLessThanOrEqual(columns.length);
        expect(cost.sourceFields, "#3").toBeLessThanOrEqual(1);
      });
      test("an edit is a pass per change of the control", () => {
        const { survey, q } = create();
        const cost = measure(survey, () => { q.setFieldCondition("city", "equal", "Paris"); });
        expect(cost.toolbarUpdates, "#1").toBeLessThanOrEqual(4);
        expect(cost.conditionJson, "#2").toBeLessThanOrEqual(cost.toolbarUpdates * columns.length + 4);
        expect(cost.sourceFields, "#3").toBeLessThanOrEqual(cost.toolbarUpdates * 2);
      });
    });
  });
});

// What the toolbars show of a bound field list can change with no notification to the control: a
// value change is when they look again.
describe("QuestionFilterModel: the bound fields the toolbars follow on a value change", () => {
  test("a column added to the source gets its chip", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f");
    const matrix: any = survey.getQuestionByName("m");
    q.chipsToolbar;
    matrix.addColumn("extra");
    survey.setValue("t1", "x");
    expect(q.chipsToolbar.getActionById("sv-filter-field-extra")).toBeTruthy();
  });
  test("a column title that shows a value follows it", () => {
    const survey = createSurvey();
    const q = <QuestionFilterModel>survey.getQuestionByName("f");
    const matrix: any = survey.getQuestionByName("m");
    matrix.getColumnByName("qty").title = "Qty in {t2}";
    const chip = q.chipsToolbar.getActionById("sv-filter-field-qty");
    survey.setValue("t2", "boxes");
    expect(chip.title, "#1").toBe("Qty in boxes");
    survey.setValue("t2", "crates");
    expect(chip.title, "#2").toBe("Qty in crates");
  });
});
