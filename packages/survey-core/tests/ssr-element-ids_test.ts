import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionFileModel, QuestionFilePage } from "../src/question_file";
import { PanelModel } from "../src/panel";
import { ItemValue } from "../src/itemvalue";
import { Action } from "../src/actions/action";
import { ActionContainer } from "../src/actions/container";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { Base } from "../src/base";
import { settings } from "../src/settings";

import { describe, test, expect, afterEach } from "vitest";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "q1", validators: [{ type: "numeric" }, { type: "text", minLength: 2 }] },
        {
          type: "panel", name: "panel1", elements: [
            { type: "comment", name: "q2" },
            { type: "checkbox", name: "q3", hasOther: true, hasNone: true, choices: ["a", "b", "c"] },
          ]
        },
      ]
    },
    {
      name: "page2",
      elements: [
        { type: "radiogroup", name: "q4", choices: ["x", "y"] },
        {
          type: "matrixdynamic", name: "q5", rowCount: 2,
          columns: [{ name: "col1", cellType: "dropdown", choices: [1, 2] }]
        },
      ]
    },
  ]
};

// Walks the survey and collects every id-bearing value we migrated, in a stable order, so two
// independent builds of the same JSON can be compared byte-for-byte.
function collectIds(survey: SurveyModel): Array<string> {
  const res: Array<string> = [];
  survey.pages.forEach((page) => {
    res.push("page:" + page.id);
    page.rows.forEach((row) => res.push("row:" + row.id));
    page.questions.forEach((q: any) => {
      res.push("q:" + q.id);
      res.push("input:" + q.inputId);
      res.push("ariaTitle:" + q.ariaTitleId);
      res.push("ariaDescr:" + q.ariaDescriptionId);
      q.validators?.forEach((v: any) => res.push("validator:" + v.id));
      q.visibleChoices?.forEach((item: ItemValue) => res.push("itemId:" + q.getItemId(item)));
      if (q.getType() === "matrixdynamic") {
        q.visibleRows.forEach((r: any) => {
          res.push("mrow:" + r.id);
          r.cells.forEach((c: any) => res.push("cellq:" + c.question.id));
        });
      }
    });
  });
  return res;
}

describe("SSR-safe element ids", () => {
  afterEach(() => {
    settings.getElementId = undefined;
  });

  describe("Cross-instance determinism", () => {
    test("Two independent models from the same JSON produce byte-identical id sets", () => {
      const ids1 = collectIds(new SurveyModel(json));
      const ids2 = collectIds(new SurveyModel(json));
      expect(ids2).toEqual(ids1);
      expect(ids1.length).toBeGreaterThan(20);
    });

    test("Building many surveys does not drift ids (no shared/module counter) - first question is always sq_0", () => {
      for (let i = 0; i < 5; i++) {
        const survey = new SurveyModel(json);
        expect(survey.getQuestionByName("q1").id).toBe("sq_0");
      }
    });

    test("uniqueId is per-survey and deterministic across two identical builds", () => {
      const s1 = new SurveyModel(json);
      const s2 = new SurveyModel(json);
      expect(s2.getQuestionByName("q1").uniqueId).toBe(s1.getQuestionByName("q1").uniqueId);
      // distinct elements within one survey get distinct uniqueIds
      const u1 = s1.getQuestionByName("q1").uniqueId;
      const u4 = s1.getQuestionByName("q4").uniqueId;
      expect(u1).not.toBe(u4);
    });
  });

  describe("Prefixes and format", () => {
    test("Each element kind keeps its historical prefix and is index-like (starts at 0)", () => {
      const survey = new SurveyModel(json);
      const q1 = survey.getQuestionByName("q1");
      expect(q1.id).toBe("sq_0");
      expect(q1.inputId).toBe("sq_0i");
      expect(q1.ariaTitleId).toBe("sq_0_ariaTitle");
      expect(q1.ariaDescriptionId).toBe("sq_0_ariaDescription");
      expect(survey.pages[0].id).toBe("sp_0");
      expect((<PanelModel>survey.getPanelByName("panel1")).id.startsWith("sp_")).toBe(true);
      expect((q1 as any).validators[0].id).toBe("svd_0");
      expect((q1 as any).validators[1].id).toBe("svd_1");
      expect(survey.pages[0].rows[0].id.startsWith("pr_")).toBe(true);
    });

    test("Matrix rows use the srow prefix and are deterministic across two models", () => {
      const s1 = new SurveyModel(json);
      const s2 = new SurveyModel(json);
      const rows1 = (s1.getQuestionByName("q5") as QuestionMatrixDynamicModel).visibleRows;
      const rows2 = (s2.getQuestionByName("q5") as QuestionMatrixDynamicModel).visibleRows;
      expect(rows1[0].id.startsWith("srow_")).toBe(true);
      expect(rows2.map((r) => r.id)).toEqual(rows1.map((r) => r.id));
    });

    test("QuestionFilePage uses the sv_sfp prefix and routes through the survey generator", () => {
      const survey = new SurveyModel({ elements: [{ type: "file", name: "f1" }] });
      const fileQuestion = survey.getQuestionByName("f1") as QuestionFileModel;
      const page0 = new QuestionFilePage(fileQuestion, 0);
      const page1 = new QuestionFilePage(fileQuestion, 1);
      expect(page0.id).toBe("sv_sfp_0");
      expect(page1.id).toBe("sv_sfp_1");
    });

    test("Choice input ids are index-based and deterministic across two models", () => {
      const s1 = new SurveyModel(json);
      const s2 = new SurveyModel(json);
      const q3a = s1.getQuestionByName("q3") as QuestionCheckboxModel;
      const q3b = s2.getQuestionByName("q3") as QuestionCheckboxModel;
      const ids1 = q3a.visibleChoices.map((i) => q3a.getItemId(i));
      const ids2 = q3b.visibleChoices.map((i) => q3b.getItemId(i));
      expect(ids1[0]).toBe(q3a.inputId + "_0");
      expect(ids2).toEqual(ids1);
    });
  });

  describe("idPrefix (multiple surveys on one page)", () => {
    test("Distinct idPrefix namespaces every id - no collision between two surveys", () => {
      const survey1 = new SurveyModel(json); survey1.idPrefix = "a-";
      const survey2 = new SurveyModel(json); survey2.idPrefix = "b-";
      const ids1 = collectIds(survey1);
      const ids2 = collectIds(survey2);
      expect(ids1[0]).toBe("page:a-sp_0");
      expect(ids2[0]).toBe("page:b-sp_0");
      const set1 = new Set(ids1);
      expect(ids2.some((id) => set1.has(id))).toBe(false);
    });

    test("Without idPrefix, two surveys reuse the same ids (documented limitation)", () => {
      const ids1 = collectIds(new SurveyModel(json));
      const ids2 = collectIds(new SurveyModel(json));
      expect(ids2).toEqual(ids1);
    });

    test("idPrefix set after construction still applies (no id is generated during load)", () => {
      const survey = new SurveyModel(json);
      survey.idPrefix = "x-";
      expect(survey.getQuestionByName("q1").id).toBe("x-sq_0");
      expect(survey.pages[0].id).toBe("x-sp_0");
    });
  });

  describe("Explicit id and settings hook", () => {
    test("An explicitly assigned id wins and propagates to derived ids", () => {
      const survey = new SurveyModel(json);
      const q1 = survey.getQuestionByName("q1");
      q1.id = "my-custom-id";
      expect(q1.id).toBe("my-custom-id");
      expect(q1.inputId).toBe("my-custom-idi");
      expect(q1.ariaTitleId).toBe("my-custom-id_ariaTitle");
    });

    test("settings.getElementId fully controls id generation and receives the kind", () => {
      settings.getElementId = (owner: any, kind: string) => `${kind}--${owner.name || "x"}`;
      const survey = new SurveyModel(json);
      expect(survey.getQuestionByName("q1").id).toBe("sq--q1");
      expect(survey.pages[0].id).toBe("sp--page1");
      expect((survey.getQuestionByName("q1") as any).validators[0].id).toBe("svd--x");
    });
  });

  describe("Choice 'other'/comment ids", () => {
    test("Other/none comment ids are deterministic across two models", () => {
      const q3a = new SurveyModel(json).getQuestionByName("q3") as QuestionCheckboxModel;
      const q3b = new SurveyModel(json).getQuestionByName("q3") as QuestionCheckboxModel;
      expect(q3b.otherId).toBe(q3a.otherId);
      expect(q3a.otherId.startsWith(q3a.id + "_")).toBe(true);
    });
  });

  describe("Actions", () => {
    test("BaseAction.renderedElementId is generated, deterministic per survey, and namespaced by idPrefix", () => {
      const s1 = new SurveyModel(json);
      const s2 = new SurveyModel(json);
      const a1 = new Action({ id: "act1" }); a1.owner = s1 as any;
      const a2 = new Action({ id: "act1" }); a2.owner = s2 as any;
      expect(a1.renderedElementId.startsWith("sv-action_")).toBe(true);
      expect(a2.renderedElementId).toBe(a1.renderedElementId);

      const s3 = new SurveyModel(json); s3.idPrefix = "p3-";
      const a3 = new Action({ id: "act1" }); a3.owner = s3 as any;
      expect(a3.renderedElementId).toBe("p3-sv-action_0");
      // the semantic id is independent from the rendered DOM id
      expect(a3.id).toBe("act1");
    });

    test("renderedId equals uniqueId (framework key, not a DOM id)", () => {
      const survey = new SurveyModel(json);
      const a = new Action({ id: "act" }); a.owner = survey as any;
      expect(a.renderedId).toBe(a.uniqueId);
    });

    test("Actions hosted in a container resolve the survey generator, not the fallback", () => {
      const survey = new SurveyModel(json);
      survey.idPrefix = "nav-";
      const container = new ActionContainer();
      container.locOwner = survey as any;
      container.setItems([{ id: "a1" }]);
      const action = container.actions[0];
      // owner is the container (set by patchAction); the container surfaces the survey via locOwner
      expect(action.renderedElementId).toBe("nav-sv-action_0");
    });

    test("AdaptiveActionContainer dots item resolves the survey generator", () => {
      const survey = new SurveyModel(json);
      survey.idPrefix = "dots-";
      const container = new AdaptiveActionContainer();
      container.locOwner = survey as any;
      expect(container.dotsItem.renderedElementId.startsWith("dots-sv-action_")).toBe(true);
    });
  });

  describe("Detached objects (no survey)", () => {
    test("A standalone ItemValue keeps its value-based id and needs no survey", () => {
      const item = new ItemValue("red");
      expect(item.id).toBe("red");
      expect(typeof item.uniqueId).toBe("number");
    });

    test("A standalone Action generates a fallback id without throwing", () => {
      const a = new Action({ title: "Standalone" });
      expect(a.renderedElementId.startsWith("sv-action_")).toBe(true);
    });

    test("Base.getIdGeneratorBySurvey falls back to the shared generator when survey is null", () => {
      expect(Base.getIdGeneratorBySurvey(null)).toBe(Base.defaultIdGenerator);
      expect(Base.getIdGeneratorBySurvey(undefined)).toBe(Base.defaultIdGenerator);
      const fake: any = { idGenerator: {} };
      expect(Base.getIdGeneratorBySurvey(fake)).toBe(fake.idGenerator);
    });
  });

  describe("Robustness", () => {
    test("Prefixes that collide with Object.prototype keys do not corrupt id generation", () => {
      // getIdPrefix() defaults to getType(); for a custom component that is an author-chosen name,
      // which could be "toString", "constructor", "__proto__", etc.
      const gen = new SurveyModel(json).idGenerator;
      expect(gen.next("toString")).toBe("toString_0");
      expect(gen.next("toString")).toBe("toString_1");
      expect(gen.next("constructor")).toBe("constructor_0");
      expect(gen.next("__proto__")).toBe("__proto___0");
      expect(gen.next("hasOwnProperty")).toBe("hasOwnProperty_0");
    });
  });
});
