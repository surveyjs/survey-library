import { ConsoleWarnings } from "../src/console-warnings";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("SurveySerialization", () => {
  const errorText = "Self-hosted Form Library no longer supports integration with SurveyJS Demo Service. Learn more: https://surveyjs.io/stay-updated/release-notes/v2.0.0#form-library-removes-apis-for-integration-with-surveyjs-demo-service";

  test("survey.beginLoading()/survey.endLoading()", () => {
    const survey = new SurveyModel();
    expect(survey.state, "state #1").toBe("empty");
    survey.beginLoading();
    expect(survey.state, "state #2").toBe("loading");
    survey.endLoading();
    expect(survey.state, "state #3").toBe("empty");
    survey.beginLoading();
    expect(survey.state, "state #4").toBe("loading");
    survey.fromJSON({ elements: [{ type: "text", name: "q1" }] });
    expect(survey.state, "state #5").toBe("running");
  });
  test("Show warning in console on loading survey", () => {
    const prev = ConsoleWarnings.warn;
    let reportText: string = "";
    ConsoleWarnings.warn = (text: string) => {
      reportText = text;
    };
    let survey = new SurveyModel({ surveyId: "abcde" });

    expect(survey.state, "state #1").toBe("empty");
    expect(reportText, "Error on loading, #1").toBe(errorText);
    reportText = "";
    survey.loadSurveyFromService("abcde");
    expect(reportText, "Error on loading, #2").toBe(errorText);

    ConsoleWarnings.warn = prev;
  });
  test("Show warning in console on loading survey", () => {
    const prev = ConsoleWarnings.warn;
    let reportText: string = "";
    ConsoleWarnings.warn = (text: string) => {
      reportText = text;
    };
    let survey = new SurveyModel({ surveyPostId: "abcde", elements: [{ type: "text", name: "q1", defaultValue: 1 }] });

    expect(survey.state, "state #1").toBe("running");
    survey.doComplete();
    expect(survey.state, "state #2").toBe("completed");
    expect(reportText, "Error on loading, #1").toBe(errorText);

    ConsoleWarnings.warn = prev;
  });
  test("Show warning in console on sendResult/getResult", () => {
    const prev = ConsoleWarnings.warn;
    let reportText: string = "";
    ConsoleWarnings.warn = (text: string) => {
      reportText = text;
    };
    let survey = new SurveyModel();
    survey.sendResult("abcde");
    expect(reportText, "Error on sendResult, #1").toBe(errorText);
    reportText = "";
    survey.getResult("abcde", "q1");
    expect(reportText, "Error on getResult, #2").toBe(errorText);
    ConsoleWarnings.warn = prev;
  });
});
